<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  try {
    const response = await http.get(ENDPOINT)
    console.log('✅ Productos:', response.data)
    productos.value = response.data
  } catch (error) {
    console.error('❌ Error:', error)
  }
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
      producto.codigo.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o código" />
      </InputGroup>
    </div>

    <table class="mt-4">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Stock Mín.</th>
          <th>Vencimiento</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.codigo }}</td>
          <td>{{ producto.nombre }}</td>
          <td>Bs. {{ producto.precioUnitario }}</td>
          <td>{{ producto.stock }}</td>
          <td>{{ producto.cantidadMinimaStock }}</td>
          <td>
            {{
              producto.fechaVencimiento
                ? new Date(producto.fechaVencimiento).toLocaleDateString()
                : '-'
            }}
          </td>
          <td>
            <img
              :src="producto.imagen || '/placeholder.jpg'"
              alt="Producto"
              width="60"
              style="border-radius: 4px"
            />
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
          <td colspan="9">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

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
