<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'proveedores'

const proveedores = ref<Proveedor[]>([])
const emit = defineEmits(['edit'])

const proveedorDelete = ref<Proveedor | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(proveedor: Proveedor) {
  emit('edit', proveedor)
}

function mostrarEliminarConfirm(proveedor: Proveedor) {
  proveedorDelete.value = proveedor
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
    await obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error) {
    console.error('Error eliminar:', error)
  }
}

const proveedoresFiltrados = computed(() => {
  return proveedores.value.filter(
    (proveedor) =>
      proveedor.nombreEmpresa?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.telefono?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.direccion?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.email?.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

onMounted(() => {
  obtenerLista()
})

defineExpose({
  obtenerLista,
})
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
          placeholder="Buscar proveedor"
          class="search-input"
        />
      </InputGroup>
    </div>

    <!-- TABLA CREMA -->
    <DataTable
      :value="proveedoresFiltrados"
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

      <Column field="nombreEmpresa" header="Empresa" sortable>
        <template #body="{ data }">
          <span class="empresa-nombre">{{ data.nombreEmpresa }}</span>
        </template>
      </Column>

      <Column field="telefono" header="Teléfono" sortable>
        <template #body="{ data }">
          <span class="telefono-badge">{{ data.telefono }}</span>
        </template>
      </Column>

      <Column field="direccion" header="Dirección" sortable>
        <template #body="{ data }">
          <span class="direccion-text">{{ data.direccion }}</span>
        </template>
      </Column>

      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          <span class="email-badge">{{ data.email }}</span>
        </template>
      </Column>

      <Column header="Acciones" frozen align-frozen="right" style="min-width: 140px">
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
          <th>Empresa</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proveedor, index) in proveedoresFiltrados" :key="proveedor.id">
          <td>{{ proveedor.nombreEmpresa }}</td>
          <td>{{ proveedor.telefono }}</td>
          <td>{{ proveedor.direccion }}</td>
          <td>{{ proveedor.email }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(proveedor)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(proveedor)" />
          </td>
        </tr>
        <tr v-if="proveedoresFiltrados.length === 0">
          <td colspan="5">No se encontraron resultados.</td>
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
        <p class="dialog-message">¿Estás seguro de que deseas eliminar este proveedor?</p>
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

/* Empresa nombre */
.empresa-nombre {
  font-weight: 700;
  font-size: 15px;
  color: #1f1f1f;
}

/* Teléfono */
.telefono-badge {
  background: #fce7f3;
  color: #ec4899;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Dirección */
.direccion-text {
  color: #666;
  font-size: 14px;
}

/* Email */
.email-badge {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
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