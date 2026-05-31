<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'proveedores'

const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor,
    default: () =>
      ({
        id: 0,
        nombreEmpresa: '',
        telefono: '',
        direccion: '',
        email: '',
      }) as Proveedor,
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

const proveedor = ref<Proveedor>({ ...props.proveedor })

watch(
  () => props.proveedor,
  (newVal) => {
    proveedor.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombreEmpresa: proveedor.value.nombreEmpresa,
      telefono: proveedor.value.telefono,
      direccion: proveedor.value.direccion,
      email: proveedor.value.email,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${proveedor.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')

    proveedor.value = {
      id: 0,
      nombreEmpresa: '',
      telefono: '',
      direccion: '',
      email: '',
    }

    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      if (props.proveedor?.id) {
        proveedor.value = { ...props.proveedor }
      } else {
        proveedor.value = {
          id: 0,
          nombreEmpresa: '',
          telefono: '',
          direccion: '',
          email: '',
        }
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Proveedor'"
      style="width: 30rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombreEmpresa" class="font-semibold w-4">
          Empresa
        </label>

        <InputText
          id="nombreEmpresa"
          v-model="proveedor.nombreEmpresa"
          class="flex-auto"
          autofocus
          maxlength="100"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="telefono" class="font-semibold w-4">
          Teléfono
        </label>

        <InputText
          id="telefono"
          v-model="proveedor.telefono"
          class="flex-auto"
          maxlength="10"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="direccion" class="font-semibold w-4">
          Dirección
        </label>

        <InputText
          id="direccion"
          v-model="proveedor.direccion"
          class="flex-auto"
          maxlength="200"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-4">
          Email
        </label>

        <InputText
          id="email"
          v-model="proveedor.email"
          class="flex-auto"
          maxlength="100"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />

        <Button
          type="button"
          label="Guardar"
          icon="pi pi-save"
          @click="handleSave"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>