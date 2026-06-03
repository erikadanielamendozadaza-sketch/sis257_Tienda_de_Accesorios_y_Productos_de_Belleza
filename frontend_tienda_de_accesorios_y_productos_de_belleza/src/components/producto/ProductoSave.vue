<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import type { Marca } from '@/models/marca'
import type { Producto } from '@/models/producto'
import type { Proveedor } from '@/models/proveedor'
import type { UnidadMedida } from '@/models/unidad_medida'
import http from '@/plugins/axios'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'
import { DatePicker } from 'primevue'

const ENDPOINT = 'productos'

const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const categorias = ref<Categoria[]>([])
const marcas = ref<Marca[]>([])
const unidadesMedida = ref<UnidadMedida[]>([])
const proveedores = ref<Proveedor[]>([])

const producto = ref<Producto>({ ...props.producto })

watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
  },
)

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((res) => res.data)
}

async function obtenerMarcas() {
  marcas.value = await http.get('marcas').then((res) => res.data)
}

async function obtenerUnidadesMedida() {
  unidadesMedida.value = await http.get('unidades-medida').then((res) => res.data)
}

async function obtenerProveedores() {
  proveedores.value = await http.get('proveedores').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      idCategoria: producto.value.categoria.id,
      idMarca: producto.value.marca.id,
      idUnidadMedida: producto.value.unidadMedida.id,
      idProveedor: producto.value.proveedor.id,
      codigo: producto.value.codigo,
      nombre: producto.value.nombre,
      precioUnitario: producto.value.precioUnitario,
      stock: producto.value.stock,
      cantidadMinimaStock: producto.value.cantidadMinimaStock,
      fechaVencimiento: producto.value.fechaVencimiento,
      imagen: producto.value.imagen,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar')
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCategorias()
      obtenerMarcas()
      obtenerUnidadesMedida()
      obtenerProveedores()

      if (props.producto?.id) {
        producto.value = { ...props.producto }
      } else {
        producto.value = {
          categoria: { id: 0 },
          marca: { id: 0 },
          unidadMedida: { id: 0 },
          proveedor: { id: 0 },
        } as Producto
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Nuevo') + ' Producto'"
      :modal="true"
      :dismissableMask="true"
      :closable="true"
      :maximizable="false"
      position="center"
      class="dialog-rosa dialog-sin-scroll"
    >
      <div class="form-grid">
        <!-- CATEGORÍA -->
        <div class="form-group">
          <label for="categoria" class="form-label">Categoría</label>
          <Select
            id="categoria"
            v-model="producto.categoria.id"
            :options="categorias"
            optionLabel="nombre"
            optionValue="id"
            class="select-rosa"
            placeholder="Seleccionar"
            autofocus
          />
        </div>

        <!-- MARCA -->
        <div class="form-group">
          <label for="marca" class="form-label">Marca</label>
          <Select
            id="marca"
            v-model="producto.marca.id"
            :options="marcas"
            optionLabel="nombre"
            optionValue="id"
            class="select-rosa"
            placeholder="Seleccionar"
          />
        </div>

        <!-- UNIDAD MEDIDA -->
        <div class="form-group">
          <label for="unidadMedida" class="form-label">Unidad de Medida</label>
          <Select
            id="unidadMedida"
            v-model="producto.unidadMedida.id"
            :options="unidadesMedida"
            optionLabel="descripcion"
            optionValue="id"
            class="select-rosa"
            placeholder="Seleccionar"
          />
        </div>

        <!-- PROVEEDOR -->
        <div class="form-group">
          <label for="proveedor" class="form-label">Proveedor</label>
          <Select
            id="proveedor"
            v-model="producto.proveedor.id"
            :options="proveedores"
            optionLabel="nombreEmpresa"
            optionValue="id"
            class="select-rosa"
            placeholder="Seleccionar"
          />
        </div>

        <!-- CÓDIGO -->
        <div class="form-group">
          <label for="codigo" class="form-label">Código</label>
          <InputText
            id="codigo"
            v-model="producto.codigo"
            class="input-rosa"
            placeholder="PROD001"
            autocomplete="off"
            maxlength="10"
          />
        </div>

        <!-- NOMBRE -->
        <div class="form-group">
          <label for="nombre" class="form-label">Nombre</label>
          <InputText
            id="nombre"
            v-model="producto.nombre"
            class="input-rosa"
            placeholder="Nombre del producto"
            autocomplete="off"
            maxlength="100"
          />
        </div>

        <!-- PRECIO -->
        <div class="form-group">
          <label for="precio" class="form-label">Precio (Bs)</label>
          <InputNumber
            id="precio"
            v-model="producto.precioUnitario"
            mode="decimal"
            :min="0"
            class="input-rosa"
            placeholder="0.00"
          />
        </div>

        <!-- STOCK -->
        <div class="form-group">
          <label for="stock" class="form-label">Stock</label>
          <InputNumber
            id="stock"
            v-model="producto.stock"
            :min="0"
            :max="9999"
            :step="1"
            showButtons
            class="input-number-rosa"
            placeholder="0"
          />
        </div>

        <!-- STOCK MÍNIMO -->
        <div class="form-group">
          <label for="stockMinimo" class="form-label">Stock Mínimo</label>
          <InputNumber
            id="stockMinimo"
            v-model="producto.cantidadMinimaStock"
            :min="0"
            :max="Math.floor((producto.stock || 0) * 0.5)"
            :step="1"
            showButtons
            class="input-number-rosa"
            placeholder="0"
          />
        </div>

        <!-- FECHA -->
        <div class="form-group">
          <label for="fecha" class="form-label">Fecha Vencimiento</label>
          <DatePicker
            id="fecha"
            v-model="producto.fechaVencimiento"
            class="input-rosa"
            dateFormat="dd/mm/yy"
            :showIcon="true"
            placeholder="dd/mm/aa"
            :minDate="new Date()"  
          />
        </div>

        <!-- IMAGEN -->
        <div class="form-group span-full">
          <label for="imagen" class="form-label">Imagen (URL)</label>
          <Textarea
            id="imagen"
            v-model="producto.imagen"
            class="input-rosa"
            rows="2"
            placeholder="https://..."
            maxlength="200"
          />
        </div>
      </div>

      <!-- BOTONES -->
      <div class="form-actions">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          class="btn-cancelar"
          @click="dialogVisible = false"
        />

        <Button
          type="button"
          label="Guardar"
          icon="pi pi-save"
          class="btn-guardar"
          @click="handleSave"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* Dialog sin scroll */
:deep(.dialog-sin-scroll) {
  max-height: 90vh !important;
}

:deep(.dialog-sin-scroll .p-dialog-content) {
  max-height: 80vh !important;
  overflow: visible !important;
  padding: 0 !important;
}

:deep(.dialog-sin-scroll .p-dialog-body) {
  max-height: 80vh !important;
  overflow: visible !important;
  padding: 1.5rem !important;
}

/* Grid layout COMPACTO - 3 columnas */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.span-full {
  grid-column: span 3;
}

/* Form group - más compacto */
.form-group {
  margin-bottom: 8px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 4px;
  font-size: 12px;
}

/* Input compacta */
.input-rosa {
  width: 100%;
  border: 2px solid #fce7f3;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  background: #fffafc;
}

.input-rosa:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.1);
}

.input-rosa::placeholder {
  color: #aaa;
  font-size: 12px;
}

/* Select compacta */
.select-rosa {
  width: 100%;
  border: 2px solid #fce7f3;
  border-radius: 8px;
  background: #fffafc;
}

:deep(.p-select-label) {
  padding: 8px 10px !important;
  font-size: 13px !important;
}

:deep(.p-select-dropdown) {
  padding: 4px !important;
}

/* Input number compacta */
:deep(.p-inputnumber-input) {
  padding: 8px 10px !important;
  font-size: 13px !important;
}

/* DatePicker compacta */
:deep(.p-datepicker-input) {
  padding: 8px 10px !important;
  font-size: 13px !important;
}

/* Textarea compacta */
:deep(.p-textarea) {
  padding: 8px 10px !important;
  font-size: 13px !important;
}

/* Acciones */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #fce7f3;
}

/* Botón compacta */
.btn-cancelar {
  background: #f5f5f5 !important;
  border-color: #e5e5e5 !important;
  color: #333 !important;
  padding: 8px 16px !important;
  border-radius: 20px;
  font-weight: 500;
  font-size: 13px;
}

.btn-guardar {
  background: #ec4899 !important;
  border-color: #ec4899 !important;
  color: white !important;
  padding: 8px 20px !important;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
}
</style>
