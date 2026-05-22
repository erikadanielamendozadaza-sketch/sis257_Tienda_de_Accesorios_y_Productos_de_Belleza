<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'clientes'

const props = defineProps({
  mostrar: Boolean,
  cliente: {
    type: Object as () => Cliente,
    default: () =>
      ({
        id: 0,
        razonSocial: '',
        cedulaIdentidad: '',
      }) as Cliente,
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

const cliente = ref<Cliente>({ ...props.cliente })

watch(
  () => props.cliente,
  (newVal) => {
    cliente.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      razonSocial: cliente.value.razonSocial,
      cedulaIdentidad: cliente.value.cedulaIdentidad,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${cliente.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')

    cliente.value = {
      id: 0,
      razonSocial: '',
      cedulaIdentidad: '',
    }

    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Cliente' : 'Crear Cliente'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="razonSocial" class="font-semibold w-3">Razón Social</label>
        <InputText
          id="razonSocial"
          v-model="cliente.razonSocial"
          class="flex-auto"
          autofocus
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="cedulaIdentidad" class="font-semibold w-3">CI</label>
        <InputText
          id="cedulaIdentidad"
          v-model="cliente.cedulaIdentidad"
          class="flex-auto"
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