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
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Producto'"
      style="width: 25rem"
    >
      <!-- CATEGORÍA -->
      <div class="flex items-center gap-4 mb-4">
        <label for="categoria" class="font-semibold w-3"> Categoría </label>
        <Select
          id="categoria"
          v-model="producto.categoria.id"
          :options="categorias"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>

      <!-- MARCA -->
      <div class="flex items-center gap-4 mb-4">
        <label for="marca" class="font-semibold w-3"> Marca </label>
        <Select
          id="marca"
          v-model="producto.marca.id"
          :options="marcas"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>

      <!-- UNIDAD MEDIDA -->
      <div class="flex items-center gap-4 mb-4">
        <label for="unidadMedida" class="font-semibold w-3"> Unidad de Medida </label>
        <Select
          id="unidadMedida"
          v-model="producto.unidadMedida.id"
          :options="unidadesMedida"
          optionLabel="descripcion"
          optionValue="id"
          class="flex-auto"
        />
      </div>

      <!-- PROVEEDOR -->
      <div class="flex items-center gap-4 mb-4">
        <label for="proveedor" class="font-semibold w-3"> Proveedor </label>
        <Select
          id="proveedor"
          v-model="producto.proveedor.id"
          :options="proveedores"
          optionLabel="nombreEmpresa"
          optionValue="id"
          class="flex-auto"
        />
      </div>

      <!-- CÓDIGO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="codigo" class="font-semibold w-3"> Código </label>
        <InputText
          id="codigo"
          v-model="producto.codigo"
          class="flex-auto"
          autocomplete="off"
          maxlength="10"
        />
      </div>

      <!-- NOMBRE -->
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3"> Nombre </label>
        <InputText
          id="nombre"
          v-model="producto.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="100"
        />
      </div>

      <!-- PRECIO -->
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3"> Precio </label>
        <InputNumber
          id="precio"
          v-model="producto.precioUnitario"
          mode="decimal"
          :min="0"
          class="flex-auto"
        />
      </div>

      <!-- STOCK -->
      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-3"> Stock </label>
        <InputNumber
          id="stock"
          v-model="producto.stock"
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
        <label for="stockMinimo" class="font-semibold w-3"> Stock Min. </label>
        <InputNumber
          id="stockMinimo"
          v-model="producto.cantidadMinimaStock"
          :min="0"
          :max="Math.floor((producto.stock || 0) * 0.5)"
          :step="1"
          showButtons
          class="w-24 p-inputnumber-sm"
        />
      </div>

      <!-- FECHA -->
      <div class="flex items-center gap-4 mb-4">
        <label for="fecha" class="font-semibold w-3"> Fecha </label>
        <DatePicker
          id="fecha"
          v-model="producto.fechaVencimiento"
          class="flex-auto"
          dateFormat="dd/mm/yy"
          :showIcon="true"
        />
      </div>

      <!-- IMAGEN -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagen" class="font-semibold w-3"> Imagen </label>
        <Textarea
          id="imagen"
          v-model="producto.imagen"
          class="flex-auto"
          rows="3"
          maxlength="200"
        />
      </div>

      <!-- BOTONES -->
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
