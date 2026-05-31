<script lang="ts" setup>
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
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
  await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

const proveedoresFiltrados = computed(() => {
  return proveedores.value.filter(
    (proveedor) =>
      proveedor.nombreEmpresa.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.telefono.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.direccion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(busqueda.value.toLowerCase()),
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
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-search"></i>
        </InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar proveedor"
        />
      </InputGroup>
    </div>

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
    >
      <template #paginatorstart>
        <Button
          type="button"
          icon="pi pi-refresh"
          text
          @click="obtenerLista"
        />
      </template>

      <Column field="nombreEmpresa" header="Empresa" sortable />
      <Column field="telefono" header="Teléfono" sortable />
      <Column field="direccion" header="Dirección" sortable />
      <Column field="email" header="Email" sortable />

      <Column
        header="Acciones"
        frozen
        align-frozen="right"
        style="min-width: 140px"
      >
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            aria-label="Editar"
            text
            @click="emitirEdicion(data)"
          />
          <Button
            icon="pi pi-trash"
            aria-label="Eliminar"
            text
            @click="mostrarEliminarConfirm(data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este proveedor?</p>

      <div class="flex justify-end gap-2">
        <Button
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />

        <Button
          label="Eliminar"
          @click="eliminar"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>