<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'

const router = useRouter()

const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])
const clienteSeleccionado = ref<Cliente | null>(null)
const cantidad = ref(1)
const descuentoPorcentaje = ref(0)
const tieneDescuento = ref(false)

const showVentaExitosa = ref(false)
const ventaResumen = ref({
  id: 0,
  cliente: '',
  productos: 0,
  total: 0,
  descuento: 0,
})

const detalles = ref<
  Array<{
    id: number
    idVenta: number
    idProducto: number
    cantidad: number
    precioUnitario: number
    descuento: number
    subtotal: number
    producto: Producto
  }>
>([])

const fecha = ref(new Date())
const busquedaProducto = ref('')
const showClienteDialog = ref(false)
const showProductoDialog = ref(false)

function getEmpleadoInfo() {
  const stored = localStorage.getItem('empleado')

  if (!stored) {
    return {
      usuario: 'Sin empleado',
      nombre: '',
      id: 1,
    }
  }

  try {
    const emp = JSON.parse(stored)

    if (typeof emp === 'string') {
      return {
        usuario: emp,
        nombre: '',
        id: 1,
      }
    }

    return {
      usuario: emp.usuario || 'Empleado',
      nombre: `${emp.nombre || ''} ${emp.primerApellido || ''} ${emp.segundoApellido || ''}`.trim(),
      id: emp.id || 1,
    }
  } catch {
    return {
      usuario: stored.replace(/"/g, ''),
      nombre: '',
      id: 1,
    }
  }
}

const empleadoActual = computed(() => getEmpleadoInfo())

const total = computed(() => {
  const subtotal = detalles.value.reduce((sum, d) => sum + (d.subtotal || 0), 0)
  const descuento = tieneDescuento.value ? subtotal * (descuentoPorcentaje.value / 100) : 0
  return subtotal - descuento
})

const subtotalSinDescuento = computed(() => {
  return detalles.value.reduce((sum, d) => sum + (d.subtotal || 0), 0)
})


async function loadClientes() {
  clientes.value = await http.get('clientes').then((res) => res.data)
}

async function loadProductos() {
  productos.value = await http.get('productos').then((res) => res.data)

  productos.value.sort((a, b) => a.nombre.localeCompare(b.nombre))
}

const productosFiltrados = computed(() => {
  if (!busquedaProducto.value.trim()) {
    return productos.value
  }

  return productos.value.filter((producto) =>
    producto.nombre.toLowerCase().includes(busquedaProducto.value.toLowerCase()),
  )
})

function openClienteDialog() {
  loadClientes()
  showClienteDialog.value = true
}

async function verificarDescuentoCliente(clienteId: number) {
  try {
    const response = await http.get('ventas/contar/cliente/' + clienteId)
    const cantidadVentas = response.data || 0

    if (cantidadVentas >= 5) {
      descuentoPorcentaje.value = 5
      tieneDescuento.value = true
    } else {
      descuentoPorcentaje.value = 0
      tieneDescuento.value = false
    }
  } catch (e) {
    descuentoPorcentaje.value = 0
    tieneDescuento.value = false
  }
}

const busquedaCliente = ref('')

const clientesFiltrados = computed(() => {
  if (!busquedaCliente.value.trim()) {
    return clientes.value
  }

  return clientes.value.filter(
    (cliente) =>
      cliente.razonSocial.toLowerCase().includes(busquedaCliente.value.toLowerCase()) ||
      cliente.cedulaIdentidad.toLowerCase().includes(busquedaCliente.value.toLowerCase()),
  )
})

function selectCliente(cliente: Cliente) {

  clienteSeleccionado.value = cliente
  showClienteDialog.value = false

  if (cliente.cedulaIdentidad === '1') {
    descuentoPorcentaje.value = 0
    tieneDescuento.value = false
    return
  }

  verificarDescuentoCliente(cliente.id)
}

function agregarNuevoCliente() {
  router.push('/clientes').then(() => {
    if (clienteSeleccionado.value) {
      verificarDescuentoCliente(clienteSeleccionado.value.id)
    }
  })
}

function openProductoDialog() {
  loadProductos()
  showProductoDialog.value = true
}

function selectProducto(producto: Producto) {
  const existente = detalles.value.find((d) => d.idProducto === producto.id)

  if (existente) {
    existente.cantidad += 1
    existente.subtotal = existente.cantidad * Number(existente.precioUnitario)

    showProductoDialog.value = false
    return
  }

  const nuevoDetalle = {
    id: 0,
    idVenta: 0,
    idProducto: producto.id,
    cantidad: cantidad.value,
    precioUnitario: Number(producto.precioUnitario),
    descuento: 0,
    subtotal: Number(producto.precioUnitario) * cantidad.value,
    producto: producto,
  }

  detalles.value.push(nuevoDetalle)
  showProductoDialog.value = false
}

function removeDetalle(index: number) {
  detalles.value.splice(index, 1)
}

function actualizarSubtotal(index: number, nuevaCantidad: number) {
  if (nuevaCantidad <= 0) {
    removeDetalle(index)
    return
  }

  const detalle = detalles.value[index]
  if (!detalle || !detalle.producto) return

  const producto = detalle.producto

  if (nuevaCantidad > producto.stock) {
    alert(`Solo hay ${producto.stock} unidades disponibles`)

    nuevaCantidad = producto.stock
  }

  detalle.cantidad = nuevaCantidad
  detalle.subtotal = nuevaCantidad * Number(producto.precioUnitario)
}

async function guardarVenta() {
  if (!clienteSeleccionado.value) {
    alert('Seleccione un cliente')
    return
  }

  if (!clienteSeleccionado.value.razonSocial) {
    alert('Seleccione un cliente válido')
    return
  }

  if (detalles.value.length === 0) {
    alert('Agregue productos')
    return
  }

  try {
    const emp = getEmpleadoInfo()
    const descuento = tieneDescuento.value ? descuentoPorcentaje.value : 0

    const ventaBody = {
      idCliente: clienteSeleccionado.value.id,
      idEmpleado: emp?.id || 1,
      fecha: fecha.value,
      total: total.value,
      descuento: descuento,
    }

    const ventaResponse = await http.post('ventas', ventaBody)
    const ventaId = ventaResponse.data.id

    for (const detalle of detalles.value) {
      const detalleBody = {
        idVenta: ventaId,
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        descuento: detalle.descuento,
        subtotal: detalle.subtotal,
      }

      await http.post('detalles-venta', detalleBody)

      const producto = detalle.producto
      if (producto) {
        await http.patch(`productos/${producto.id}`, {
          stock: producto.stock - detalle.cantidad,
        })
      }
    }

    ventaResumen.value = {
      id: ventaId,
      cliente: clienteSeleccionado.value?.razonSocial || 'Cliente',
      productos: detalles.value.length,
      total: total.value,
      descuento: descuento,
    }

    showVentaExitosa.value = true

    clienteSeleccionado.value = null
    detalles.value = []
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message || 'Error')
  }
}

function cancelar() {
  router.push('/')
}
</script>

<template>
  <section class="shop spad">
    <div class="container-fluid">
      <div class="nueva-venta-section">
        <h5 class="section-title">✨ Nueva Venta</h5>

        <div class="venta-header">
          <div class="venta-field">
            <label class="field-label">Empleado</label>
            <div class="empleado-display">
              <div class="empleado-usuario">
                <i class="pi pi-user"></i>
                {{ empleadoActual?.usuario || 'Sin empleado' }}
              </div>
              <div class="empleado-nombre">
                {{ empleadoActual?.nombre || '' }}
              </div>
            </div>
          </div>

          <div class="venta-field">
            <label class="field-label">Fecha</label>
            <div class="field-value">{{ fecha.toLocaleDateString('es-VE') }}</div>
          </div>

          <div class="venta-field cliente-section">
            <label class="field-label">Cliente</label>
            <div class="cliente-seleccionado" v-if="clienteSeleccionado">
              {{ clienteSeleccionado.razonSocial }}
              <span v-if="tieneDescuento" class="descuento-badge">
                💕 {{ descuentoPorcentaje }}% dto
              </span>
              <button class="btn-cambiar" @click="openClienteDialog">Cambiar</button>
            </div>
            <button class="btn-select" @click="openClienteDialog" v-else>
              Seleccionar Cliente
            </button>
          </div>

          <div class="venta-field">
            <label class="field-label">Subtotal</label>
            <div class="field-value subtotal-label">Bs. {{ subtotalSinDescuento.toFixed(2) }}</div>
          </div>

          <div
            class="venta-field descuento-field"
            :class="{ 'con-descuento': tieneDescuento, 'sin-descuento': !tieneDescuento }"
          >
            <label class="field-label">
              {{ tieneDescuento ? '💕 Descuento Aplicado' : 'Descuento' }}
            </label>
            <div class="descuento-valor">
              <template v-if="tieneDescuento">
                <span class="descuento-activo">-{{ descuentoPorcentaje }}%</span>
                <span class="descuento-monto"
                  >Bs. {{ (subtotalSinDescuento - total).toFixed(2) }}</span
                >
              </template>
              <template v-else>
                <span class="sin-descuento-texto">0%</span>
              </template>
            </div>
          </div>

          <div class="venta-field">
            <label class="field-label">Total a Pagar</label>
            <div class="field-total total-pagar">Bs. {{ total.toFixed(2) }}</div>
          </div>
        </div>
        <button class="btn-add" @click="openProductoDialog">
          <i class="pi pi-plus"></i> Agregar Producto
        </button>

        <table class="detalle-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in detalles" :key="index">
              <td>{{ detalle.producto?.codigo }}</td>
              <td>{{ detalle.producto?.nombre }}</td>
              <td>Bs. {{ Number(detalle.precioUnitario).toFixed(2) }}</td>
              <td class="stock-cell">
                {{ detalle.producto?.stock }}
              </td>
              <td>
                <input
                  type="number"
                  :value="detalle.cantidad"
                  @change="
                    (e: Event) =>
                      actualizarSubtotal(index, Number((e.target as HTMLInputElement).value))
                  "
                  min="1"
                  :max="detalle.producto?.stock || 1"
                  class="cantidad-input"
                />
              </td>
              <td class="subtotal-cell">Bs. {{ Number(detalle.subtotal).toFixed(2) }}</td>
              <td>
                <button class="btn-delete" @click="removeDetalle(index)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="detalles.length === 0">
              <td colspan="7" class="empty-detail">Agregue productos para la venta</td>
            </tr>
          </tbody>
        </table>

        <div class="venta-actions">
          <button class="btn-cancel" @click="cancelar">Cancelar</button>
          <button class="btn-save" @click="guardarVenta" :disabled="detalles.length === 0">
            <i class="pi pi-save"></i> Guardar Venta
          </button>
        </div>
      </div>
    </div>
  </section>

  <Dialog
    v-model:visible="showClienteDialog"
    header="Seleccionar Cliente"
    :modal="true"
    :style="{ width: '40rem' }"
  >
    <div class="buscador-cliente">
      <input
        v-model="busquedaCliente"
        type="text"
        placeholder="🔍 Buscar cliente por nombre o cédula..."
        class="input-busqueda"
      />
      <button class="btn-nuevo-dialog" @click="agregarNuevoCliente">
        <i class="pi pi-plus"></i> Agregar Nuevo Cliente
      </button>
    </div>
    <table class="dialog-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Cédula</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
          <td>{{ cliente.razonSocial }}</td>
          <td>{{ cliente.cedulaIdentidad }}</td>
          <td>
            <button class="btn-select-row" @click="selectCliente(cliente)">Seleccionar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </Dialog>

  <Dialog
    v-model:visible="showProductoDialog"
    header="Seleccionar Producto"
    :modal="true"
    :style="{ width: '50rem' }"
  >
    <div class="buscador-producto">
      <input
        v-model="busquedaProducto"
        type="text"
        placeholder="🔍 Buscar producto..."
        class="input-busqueda"
      />
    </div>
    <div class="product-grid">
      <div
        v-for="producto in productosFiltrados"
        :key="producto.id"
        class="product-card"
        :class="{ 'no-stock': producto.stock <= 0 }"
        @click="producto.stock > 0 && selectProducto(producto)"
      >
        <img :src="producto.imagen || '/img/product-placeholder.jpg'" class="product-img" />
        <div class="product-info">
          <h4>{{ producto.nombre }}</h4>
          <span class="product-code"> Código: {{ producto.codigo }} </span>
          <span class="product-price">Bs. {{ producto.precioUnitario }}</span>
          <span class="product-stock">Stock: {{ producto.stock }}</span>
        </div>
      </div>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="showVentaExitosa"
    :modal="true"
    :closable="false"
    :style="{ width: '28rem' }"
  >
    <div class="venta-exitosa">
      <div class="icono-exito">✨</div>

      <h3>Venta registrada correctamente</h3>

      <div class="resumen-card">
        <div class="fila">
          <span>N° Venta</span>
          <strong>#{{ ventaResumen.id }}</strong>
        </div>

        <div class="fila">
          <span>Cliente</span>
          <strong>{{ ventaResumen.cliente }}</strong>
        </div>

        <div class="fila">
          <span>Productos</span>
          <strong>{{ ventaResumen.productos }}</strong>
        </div>

        <div class="fila" v-if="ventaResumen.descuento > 0">
          <span>Descuento</span>
          <strong>{{ ventaResumen.descuento }}%</strong>
        </div>

        <div class="fila total">
          <span>Total</span>
          <strong>Bs. {{ ventaResumen.total.toFixed(2) }}</strong>
        </div>
      </div>

      <button class="btn-aceptar" @click="showVentaExitosa = false">Aceptar</button>
    </div>
  </Dialog>
</template>

<style scoped>
.empleado-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ec4899 !important;
  font-weight: 600;
}

.product-code {
  display: block;
  font-size: 12px;
  color: #666;
}

.empleado-info i {
  background: #ec4899;
  color: white;
  padding: 6px;
  border-radius: 50%;
}

.cliente-section {
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  flex: 2;
  min-width: 280px;
}

.cliente-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.cliente-seleccionado {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f1f1f;
  font-weight: 500;
}

.buscador-cliente {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.btn-cambiar {
  background: #fce7f3;
  color: #ec4899;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

.btn-nuevo {
  background: #1f1f1f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dialog-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.btn-nuevo-dialog {
  background: #1f1f1f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
}

.breadcrumb-option {
  padding-top: 50px;
  padding-bottom: 30px;
  background: #fffafc;
}

.breadcrumb__text {
  text-align: center;
}

.breadcrumb__text h4 {
  font-size: 42px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 10px;
}

.breadcrumb__links {
  font-size: 18px;
  color: #ec4899;
  font-weight: 600;
}

.shop {
  padding: 50px 0 80px;
}

.venta-list-table th,
.venta-list-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.nueva-venta-section {
  background: #fffafc;
  border-radius: 16px;
  padding: 25px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 20px;
}

.venta-header {
  display: flex;
  gap: 35px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  align-items: center;
}

.venta-field {
  flex: 1;
}

.field-label {
  display: block;
  font-weight: 700;
  color: #4b5563;
  font-size: 17px;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.field-value {
  font-size: 15px;
  color: #1f1f1f;
}

.field-total {
  font-size: 22px;
  font-weight: 700;
  color: #ec4899;
}

.btn-select {
  background: #ec4899;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 5px;
}

.btn-add {
  background: #1f1f1f;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 15px;
}

.detalle-table {
  width: 100%;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
}

.detalle-table th,
.detalle-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.cantidad-input {
  width: 60px;
  padding: 5px;
  border: 2px solid #fce7f3;
  border-radius: 8px;
}

.subtotal-cell {
  font-weight: 600;
  color: #ec4899;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.empty-detail {
  text-align: center;
  color: #999;
  padding: 25px;
}

.venta-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #e5e5e5;
}

.btn-save {
  background: #ec4899;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save:hover {
  background: #db2777;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.dialog-table {
  width: 100%;
}

.dialog-table th,
.dialog-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.btn-select-row {
  background: #ec4899;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.btn-select-row:hover {
  background: #db2777;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.product-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  border-color: #ec4899;
}

.product-card.no-stock {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.product-info h4 {
  font-size: 13px;
  color: #1f1f1f;
  margin-bottom: 5px;
}

.product-price {
  display: block;
  font-weight: 700;
  color: #ec4899;
}

.product-stock {
  display: block;
  font-size: 12px;
  color: #666;
}

.empleado-display {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empleado-usuario {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ec4899;
  font-weight: 600;
}

.empleado-usuario i {
  background: #ec4899;
  color: white;
  padding: 4px;
  border-radius: 50%;
  font-size: 12px;
}

.empleado-nombre {
  font-size: 13px;
  color: #666;
  font-weight: 400;
}

.descuento-badge {
  background: #ec4899;
  color: white;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
}

.field-descuento {
  color: #22c55e;
  font-weight: 700;
  font-size: 18px;
}

.descuento-field {
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
}

.descuento-field.con-descuento {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  border: 2px solid #ec4899;
}

.descuento-field.sin-descuento {
  background: #f5f5f5;
  border: 2px dashed #ddd;
}

.descuento-valor {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.descuento-activo {
  background: #ec4899;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
}

.descuento-monto {
  color: #22c55e;
  font-weight: 700;
  font-size: 16px;
}

.sin-descuento-texto {
  color: #999;
  font-size: 16px;
  font-weight: 600;
}

.subtotal-label {
  font-size: 16px;
}

.total-pagar {
  font-size: 28px;
  padding: 10px;
  background: #ec4899;
  color: white !important;
  border-radius: 10px;
  text-align: center;
}

.buscador-producto {
  margin-bottom: 20px;
}

.input-busqueda {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #fbcfe8;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  flex: 1;
}

.input-busqueda:focus {
  border-color: #ec4899;
}

.venta-exitosa {
  text-align: center;
  padding: 10px;
}

.icono-exito {
  font-size: 50px;
  margin-bottom: 10px;
}

.venta-exitosa h3 {
  color: #ec4899;
  margin-bottom: 20px;
}

.resumen-card {
  background: #fffafc;
  border: 2px solid #fbcfe8;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
}

.fila {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.total {
  border-top: 2px solid #fbcfe8;
  margin-top: 10px;
  padding-top: 12px;
  font-size: 18px;
}

.btn-aceptar {
  background: #ec4899;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
}

.btn-aceptar:hover {
  background: #db2777;
}

.cliente-field {
  min-width: 220px;
}

.cliente-seleccionado-header {
  font-size: 15px;
  color: #1f1f1f;
  font-weight: 600;
}

.btn-select-mini {
  background: #ec4899;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
}
</style>
