<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error) {
    console.error('Error eliminar:', error)
  }
}

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.codigo?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.marca?.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria?.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.unidadMedida?.descripcion?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.proveedor?.nombreEmpresa?.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <!-- BUSCADOR ROSADO -->
    <div class="col-7 pl-0 mt-3">
      <InputGroup class="search-container">
        <InputGroupAddon class="search-icon">
          <i class="pi pi-search"></i>
        </InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, código, marca y categoría"
          class="search-input"
        />
      </InputGroup>
    </div>

    <!-- TABLA CREMA -->
    <DataTable
      :value="productosFiltrados"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      scrollHeight="flex"
      tableStyle="min-width: 50rem"
      class="custom-table"
      stripedRows
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text rounded severity="help" @click="obtenerLista" />
      </template>

      <Column field="codigo" header="Código" sortable>
        <template #body="{ data }">
          <span class="codigo-badge">{{ data.codigo }}</span>
        </template>
      </Column>

      <Column field="nombre" header="Nombre" sortable>
        <template #body="{ data }">
          <span class="producto-nombre">{{ data.nombre }}</span>
        </template>
      </Column>

      <Column header="Imagen">
        <template #body="{ data }">
          <img :src="data.imagen || '/img/product-placeholder.jpg'" alt="Producto" width="60" class="producto-img" />
        </template>
      </Column>

      <Column field="categoria.nombre" header="Categoría" sortable>
        <template #body="{ data }">
          <span class="categoria-badge">{{ data.categoria?.nombre }}</span>
        </template>
      </Column>

      <Column field="marca.nombre" header="Marca" sortable>
        <template #body="{ data }">
          <span class="marca-badge">{{ data.marca?.nombre }}</span>
        </template>
      </Column>

      <Column field="unidadMedida.descripcion" header="Unidad" sortable>
        <template #body="{ data }">
          <span class="unidad-badge">{{ data.unidadMedida?.descripcion }}</span>
        </template>
      </Column>

      <Column field="proveedor.nombreEmpresa" header="Proveedor" sortable>
        <template #body="{ data }">
          <span class="proveedor-nombre">{{ data.proveedor?.nombreEmpresa }}</span>
        </template>
      </Column>

      <Column field="precioUnitario" header="Precio" sortable>
        <template #body="{ data }">
          <span class="precio-badge">Bs. {{ data.precioUnitario }}</span>
        </template>
      </Column>

      <Column field="stock" header="Stock" sortable>
        <template #body="{ data }">
          <span :class="data.stock > data.cantidadMinimaStock ? 'stock-ok' : 'stock-bajo'">
            {{ data.stock }}
          </span>
        </template>
      </Column>

      <!-- 📅 FECHA DE VENCIMIENTO -->
      <Column header="Vencimiento">
        <template #body="{ data }">
          <span v-if="data.fechaVencimiento" class="fecha-badge">
            {{ new Date(data.fechaVencimiento).toLocaleDateString('es-VE') }}
          </span>
          <span v-else class="fecha-vacio">-</span>
        </template>
      </Column>

      <!-- ACCIONES -->
      <Column header="Acciones" frozen align-frozen="right" style="min-width: 160px">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button 
              icon="pi pi-pencil" 
              aria-label="Editar" 
              text 
              rounded 
              severity="help"
              @click="emitirEdicion(data)" 
            />
            <Button 
              icon="pi pi-trash" 
              aria-label="Eliminar" 
              text 
              rounded 
              severity="danger"
              @click="mostrarEliminarConfirm(data)" 
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- TABLA OCULTA -->
    <table v-if="false">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Imagen</th>
          <th>Categoría</th>
          <th>Marca</th>
          <th>Unidad</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Stock Mínimo</th>
          <th>Fecha Vencimiento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.codigo }}</td>
          <td>{{ producto.nombre }}</td>
          <td>
            <img :src="producto.imagen" alt="Producto" width="80" style="border-radius: 6px" />
          </td>
          <td>{{ producto.categoria.nombre }}</td>
          <td>{{ producto.marca.nombre }}</td>
          <td>{{ producto.unidadMedida.descripcion }}</td>
          <td>{{ producto.proveedor.nombreEmpresa }}</td>
          <td>Bs. {{ producto.precioUnitario }}</td>
          <td>{{ producto.stock }}</td>
          <td>{{ producto.cantidadMinimaStock }}</td>
          <td>
            {{
              producto.fechaVencimiento
                ? new Date(producto.fechaVencimiento).toLocaleDateString('es-VE')
                : '-'
            }}
          </td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(producto)" />
          </td>
        </tr>
        <tr v-if="productosFiltrados.length === 0">
          <td colspan="13">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <!-- DIALOG ELIMINAR ROSADO -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
      modal
    >
      <div class="dialog-content">
        <i class="pi pi-exclamation-triangle warning-icon"></i>
        <p class="dialog-message">¿Estás seguro de que deseas eliminar este producto?</p>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button 
          label="Eliminar" 
          severity="danger" 
          icon="pi pi-trash" 
          @click="eliminar" 
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Buscador */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  border: 2px solid #fce7f3;
  border-radius: 0 50px 50px 0;
  padding: 12px 20px;
  font-size: 15px;
  background: #fffafc;
}

.search-input:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 2px #fce7f3;
}

.search-icon {
  background: #ec4899;
  border-radius: 50px 0 0 50px;
  padding: 0 15px;
  display: flex;
  align-items: center;
}

.search-icon i {
  color: #fff;
}

/* Badges Código - Negro */
.codigo-badge {
  background: #1f1f1f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

/* Nombre producto */
.producto-nombre {
  font-weight: 600;
  font-size: 14px;
  color: #1f1f1f;
}

/* Imagen */
.producto-img {
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #fce7f3;
}

/* Categoría - Rosa */
.categoria-badge {
  background: #fce7f3;
  color: #ec4899;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Marca - Crema */
.marca-badge {
  background: #fef3c7;
  color: #d97706;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Unidad - Verde crema */
.unidad-badge {
  background: #dcfce7;
  color: #16a34a;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
}

/* Proveedor */
.proveedor-nombre {
  color: #666;
  font-size: 13px;
}

/* Precio - Rosa fuerte */
.precio-badge {
  font-weight: 700;
  color: #ec4899;
  font-size: 15px;
}

/* Stock OK - Verde crema */
.stock-ok {
  background: #dcfce7;
  color: #16a34a;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
}

/* Stock Bajo - Rojo */
.stock-bajo {
  background: #fee2e2;
  color: #dc2626;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
}

/* 📅 Fecha - Amarillo crema */
.fecha-badge {
  background: #fef3c7;
  color: #d97706;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.fecha-vacio {
  color: #999;
  font-size: 12px;
}

/* Botones acción */
.action-buttons {
  display: flex;
  gap: 8px;
}

/* Dialog */
.dialog-content {
  text-align: center;
  padding: 10px 0;
}

.warning-icon {
  font-size: 3rem;
  color: #ec4899;
}

.dialog-message {
  margin-top: 15px;
  font-size: 16px;
  color: #333;
}
</style>