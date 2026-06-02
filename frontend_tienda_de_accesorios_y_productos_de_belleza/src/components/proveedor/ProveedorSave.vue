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
      :header="(props.modoEdicion ? 'Editar' : 'Nuevo') + ' Proveedor'"
      :modal="true"
      :dismissableMask="true"
      :closable="true"
      class="dialog-rosa dialog-sin-scroll"
    >
      <div class="form-container">
        <!-- Empresa -->
        <div class="form-group">
          <label for="nombreEmpresa" class="form-label">Empresa</label>
          <InputText
            id="nombreEmpresa"
            v-model="proveedor.nombreEmpresa"
            class="input-rosa"
            placeholder="Nombre de la empresa"
            autofocus
            maxlength="100"
          />
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefono" class="form-label">Teléfono</label>
          <InputText
            id="telefono"
            v-model="proveedor.telefono"
            class="input-rosa"
            placeholder="0414-1234567"
            maxlength="15"
          />
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label for="direccion" class="form-label">Dirección</label>
          <InputText
            id="direccion"
            v-model="proveedor.direccion"
            class="input-rosa"
            placeholder="Dirección completa"
            maxlength="200"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <InputText
            id="email"
            v-model="proveedor.email"
            class="input-rosa"
            placeholder="email@ejemplo.com"
            maxlength="100"
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

/* Container */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 4px;
  font-size: 12px;
}

/* Input rosa */
.input-rosa {
  width: 100%;
  border: 2px solid #fce7f3;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fffafc;
  transition: all 0.3s ease;
}

.input-rosa:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  outline: none;
  background: #fff;
}

.input-rosa::placeholder {
  color: #aaa;
  font-size: 13px;
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