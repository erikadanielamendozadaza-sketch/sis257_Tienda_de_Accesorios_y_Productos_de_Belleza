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
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.marca.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.unidadMedida.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.proveedor.nombreEmpresa.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <!-- BUSCADOR -->
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-search"></i>
        </InputGroupAddon>

        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, código, marca y categoría"
        />
      </InputGroup>
    </div>

    <!-- TABLA -->
    <DataTable
      :value="productosFiltrados"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      scrollHeight="flex"
      tableStyle="min-width: 50rem"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text />
      </template>

      <Column field="codigo" header="Código" sortable />

      <Column field="nombre" header="Nombre" sortable />

      <Column header="Imagen">
        <template #body="{ data }">
          <img :src="data.imagen" alt="Producto" width="80" style="border-radius: 6px" />
        </template>
      </Column>

      <Column field="categoria.nombre" header="Categoría" sortable />

      <Column field="marca.nombre" header="Marca" sortable />

      <Column field="unidadMedida.descripcion" header="Unidad" sortable />

      <Column field="proveedor.nombreEmpresa" header="Proveedor" sortable />

      <Column field="precioUnitario" header="Precio" sortable>
        <template #body="{ data }"> Bs. {{ data.precioUnitario }} </template>
      </Column>

      <Column field="stock" header="Stock" sortable />

      <Column field="cantidadMinimaStock" header="Stock Mínimo" sortable />

      <Column header="Fecha Vencimiento">
        <template #body="{ data }">
          {{
            data.fechaVencimiento
              ? new Date(data.fechaVencimiento).toLocaleDateString('es-VE')
              : '-'
          }}
        </template>
      </Column>

      <!-- ACCIONES -->
      <Column header="Acciones" frozen align-frozen="right" style="min-width: 160px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />

          <Button
            icon="pi pi-trash"
            aria-label="Eliminar"
            text
            @click="mostrarEliminarConfirm(data)"
          />
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

            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>

        <tr v-if="productosFiltrados.length === 0">
          <td colspan="13">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <!-- DIALOG ELIMINAR -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />

        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
