<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error) {
    console.error('Error eliminar:', error)
  }
}

const clientesFiltrados = computed(() => {
  return clientes.value.filter(
    (cliente) =>
      cliente.razonSocial?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      cliente.cedulaIdentidad?.includes(busqueda.value)
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
          placeholder="Buscar por razón social o CI"
          class="search-input"
        />
      </InputGroup>
    </div>

    <!-- TABLA CREMA -->
    <DataTable
      :value="clientesFiltrados"
      paginator
      :rows="5"
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

      <Column field="razonSocial" header="Razón Social" sortable>
        <template #body="{ data }">
          <span class="cliente-nombre">{{ data.razonSocial }}</span>
        </template>
      </Column>

      <Column field="cedulaIdentidad" header="Cédula" sortable>
        <template #body="{ data }">
          <span class="cedula-badge">{{ data.cedulaIdentidad }}</span>
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
          <th>Razón Social</th>
          <th>Cédula de Identidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id">
          <td>{{ index + 1 }}</td>
          <td>{{ cliente.razonSocial }}</td>
          <td>{{ cliente.cedulaIdentidad }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(cliente)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(cliente)" />
          </td>
        </tr>
        <tr v-if="clientesFiltrados.length === 0">
          <td colspan="7">No se encontraron resultados.</td>
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
        <p class="dialog-message">¿Estás seguro de que deseas eliminar este cliente?</p>
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

/* Cliente nombre */
.cliente-nombre {
  font-weight: 700;
  font-size: 15px;
  color: #1f1f1f;
}

/* Cédula - Negro */
.cedula-badge {
  background: #1f1f1f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

/* Teléfono */
.telefono-text {
  color: #666;
  font-size: 14px;
}

/* Correo */
.correo-text {
  color: #ec4899;
  font-size: 14px;
}

/* Dirección */
.direccion-text {
  color: #666;
  font-size: 13px;
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