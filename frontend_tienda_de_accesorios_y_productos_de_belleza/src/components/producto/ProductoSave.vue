<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Textarea } from 'primevue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    // ← CAMBIAR 'producto' igual que props
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

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto, // ← Consistente con props.producto
  (newVal) => {
    producto.value = { ...newVal }
  },
)

async function handleSave() {
  if (!producto.value.codigo?.trim()) return alert('Código obligatorio')
  if (!producto.value.nombre?.trim()) return alert('Nombre obligatorio')
  if (producto.value.precioUnitario <= 0) return alert('Precio debe ser mayor a 0')
  if (producto.value.stock < 0) return alert('Stock no puede ser negativo')
  if (producto.value.cantidadMinimaStock < 0) return alert('Stock mínimo no puede ser negativo')

  try {
    const body = {
      codigo: producto.value.codigo.trim(),
      nombre: producto.value.nombre.trim(),
      precioUnitario: Number(producto.value.precioUnitario), // ← ASEGURAR number
      stock: Number(producto.value.stock),
      cantidadMinimaStock: Number(producto.value.cantidadMinimaStock),
      imagen: producto.value.imagen?.trim() || null,
      fechaVencimiento: producto.value.fechaVencimiento || null,
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
</script>

<template>
  <div class="card flex justify-center">
    <!-- ← AGREGAR flex justify-center -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Producto' : 'Crear Producto'"
      style="width: 25rem"
    >
      <!-- CÓDIGO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="codigo" class="font-semibold w-3">Código</label>
        <InputText
          id="codigo"
          v-model="producto.codigo"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>

      <!-- NOMBRE -->
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="producto.nombre" class="flex-auto" autocomplete="off" />
      </div>

      <!-- PRECIO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3">Precio</label>
        <InputNumber
          id="precio"
          v-model="producto.precioUnitario"
          mode="decimal"
          :min="0.01"
          :max="9999.99"
          :step="0.01"
          showButtons
          class="w-28 p-inputnumber-sm"
          placeholder="0.00"
        />
      </div>

      <!-- STOCK -->
      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-3">Stock</label>
        <InputNumber
          id="stock"
          v-model="producto.stock"
          mode="decimal"
          :min="0"
          :max="9999"
          :step="1"
          showButtons
          class="w-24 p-inputnumber-sm"
          placeholder="0"
        />
      </div>

      <!-- STOCK MÍNIMO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="stockMinimo" class="font-semibold w-3">Stock Mín.</label>
        <InputNumber
          id="stockMinimo"
          v-model="producto.cantidadMinimaStock"
          mode="decimal"
          :min="0"
          :max="Math.floor(producto.stock * 0.5)"
          :step="1"
          showButtons
          class="w-24 p-inputnumber-sm"
        />
      </div>

      <!-- FECHA VENCIMIENTO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaVencimiento" class="font-semibold w-3">Vencimiento</label>
        <Calendar
          id="fechaVencimiento"
          v-model="producto.fechaVencimiento"
          class="flex-auto"
          dateFormat="dd/mm/yy"
          :showIcon="true"
          placeholder="Selecciona fecha"
        />
      </div>

      <!-- IMAGEN -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagen" class="font-semibold w-3">Imagen</label>
        <Textarea id="imagen" v-model="producto.imagen" class="flex-auto" autocomplete="off" />
      </div>

      <!-- BOTONES IGUALES AL DOCENTE -->
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
