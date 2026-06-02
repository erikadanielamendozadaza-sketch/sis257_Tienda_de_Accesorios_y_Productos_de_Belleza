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
      :header="props.modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
      :style="{ width: '28rem' }"
      modal
      class="dialog-rosa"
    >
      <!-- Título del campo -->
      <div class="form-group">
        <label for="razonSocial" class="form-label">Razón Social</label>
        <InputText
          id="razonSocial"
          v-model="cliente.razonSocial"
          class="input-rosa"
          placeholder="Ingrese la razón social"
          autofocus
        />
      </div>

      <!-- Cédula -->
      <div class="form-group">
        <label for="cedulaIdentidad" class="form-label">Cédula de Identidad</label>
        <InputText
          id="cedulaIdentidad"
          v-model="cliente.cedulaIdentidad"
          class="input-rosa"
          placeholder="V-12345678"
        />
      </div>

      <!-- Botones -->
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
/* Dialog */
.dialog-rosa {
  --dialog-border-radius: 16px;
}

/* Form group */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
  font-size: 14px;
}

/* Input rosa */
.input-rosa {
  width: 100%;
  border: 2px solid #fce7f3;
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 14px;
  background: #fffafc;
  transition: all 0.3s ease;
}

.input-rosa:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  outline: none;
}

.input-rosa::placeholder {
  color: #999;
}

/* Botones action */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #fce7f3;
}

/* Botón cancelar */
.btn-cancelar {
  background: #f5f5f5 !important;
  border-color: #e5e5e5 !important;
  color: #333 !important;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
}

.btn-cancelar:hover {
  background: #e5e5e5 !important;
  border-color: #d4d4d4 !important;
}

/* Botón guardar */
.btn-guardar {
  background: #ec4899 !important;
  border-color: #ec4899 !important;
  color: white !important;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-guardar:hover {
  background: #db2777 !important;
  border-color: #db2777 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}
</style>