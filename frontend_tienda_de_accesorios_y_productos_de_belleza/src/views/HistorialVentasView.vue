<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ventas = ref<Venta[]>([])

async function loadData() {
  ventas.value = await http.get('ventas')
    .then(res => res.data)

    ventas.value.sort((a, b) => b.id - a.id)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="venta-list-container">
    <section class="breadcrumb-option">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="breadcrumb__text">
            <h4>Historial de Ventas</h4>
            <div class="breadcrumb__links">
              <span>✨ Administración de ventas ✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

    <table class="venta-list-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Detalle de la Venta</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="venta in ventas" :key="venta.id">
          <td class="venta-id">#{{ venta.id }}</td>

          <td>
            {{ new Date(venta.fecha).toLocaleDateString('es-VE') }}
          </td>

          <td>
            {{ venta.cliente?.razonSocial || 'Cliente' }}
          </td>

          <td class="venta-total">
            Bs. {{ Number(venta.total).toFixed(2) }}
          </td>

          <td>
            <button
              class="btn-detalle"
              @click="router.push(`/detalle-venta/${venta.id}`)"
            >
              Ver detalle
            </button>
          </td>
        </tr>

        <tr v-if="ventas.length === 0">
          <td colspan="5" class="empty-message">
            No hay ventas
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.venta-list-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
}

.list-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 15px;
}

.venta-list-table {
  width: 100%;
  border-collapse: collapse;
}

.venta-id {
  font-weight: 700;
  color: #666;
}

.venta-total {
  font-weight: 700;
  color: #ec4899;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 30px;
}

.btn-detalle {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.btn-detalle:hover {
  background: #2563eb;
}

.venta-list-table th,
.venta-list-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.breadcrumb-option {
  padding-top: 50px;
  padding-bottom: 30px;
  background: #fffafc;
}

.breadcrumb__text {
  text-align: center;
}

.breadcrumb__text h4 {
  font-size: 42px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.breadcrumb__links {
  font-size: 18px;
  color: #ec4899;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>