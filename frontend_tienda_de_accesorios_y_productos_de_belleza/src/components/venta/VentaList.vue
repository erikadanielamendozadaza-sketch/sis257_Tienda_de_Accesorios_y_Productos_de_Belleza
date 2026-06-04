<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { ref, onMounted } from 'vue'

const ENDPOINT = 'ventas'
const ventas = ref<Venta[]>([])

async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then(res => res.data)
}

async function verVenta(data: Venta) {
  console.log('Ver venta:', data)
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <DataTable
      :value="ventas"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 25]"
      tableStyle="min-width: 50rem"
      class="venta-list-table"
      stripedRows
    >
      <Column field="id" header="#" sortable>
        <template #body="{ data }">
          <span class="venta-id">#{{ data.id }}</span>
        </template>
      </Column>
      
      <Column field="fecha" header="Fecha" sortable>
        <template #body="{ data }">
          <span class="fecha-text">
            {{ new Date(data.fecha).toLocaleDateString('es-VE') }}
          </span>
        </template>
      </Column>
      
      <Column field="cliente" header="Cliente">
        <template #body="{ data }">
          <span class="cliente-nombre">{{ data.cliente?.razonSocial || 'Cliente' }}</span>
        </template>
      </Column>
      
      <Column field="total" header="Total" sortable>
        <template #body="{ data }">
          <span class="total-text">Bs. {{ Number(data.total).toFixed(2) }}</span>
        </template>
      </Column>
      
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button 
            icon="pi pi-eye" 
            text 
            rounded 
            severity="info"
            @click="verVenta(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.venta-list-table {
  width: 100%;
}

.venta-id {
  font-weight: 700;
  color: #666;
}

.fecha-text {
  color: #333;
}

.cliente-nombre {
  font-weight: 600;
  color: #1f1f1f;
}

.total-text {
  font-weight: 700;
  color: #ec4899;
  font-size: 16px;
}
</style>