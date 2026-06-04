<script setup lang="ts">
import type { DetalleVenta } from '@/models/detalle_venta'
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const detalles = ref<DetalleVenta[]>([])
const venta = ref<Venta | null>(null)
const loading = ref(true)
const error = ref('')

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const ventaId = route.params.id

    const res = await http.get(`ventas/${ventaId}`)

    venta.value = res.data
    detalles.value = res.data.detalles || res.data.detallesVenta || []
  } catch (e: any) {
    console.error('Error:', e)
    error.value = e?.response?.data?.message || 'Error al cargar'
  } finally {
    loading.value = false
  }
}

function getDescuentoTotal() {
  const subtotal = detalles.value.reduce((sum, d) => sum + Number(d.subtotal), 0)

  const totalVenta = Number(venta.value?.total || 0)

  return (subtotal - totalVenta).toFixed(2)
}

function getPorcentajeDescuento() {
  const subtotal = detalles.value.reduce((sum, d) => sum + Number(d.subtotal), 0)

  const totalVenta = Number(venta.value?.total || 0)

  const descuento = subtotal - totalVenta

  if (subtotal > 0) {
    return Math.round((descuento / subtotal) * 100)
  }

  return 0
}

function goBack() {
  router.push('/ventas')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <section class="breadcrumb-option">
    <div class="container">
      <div class="breadcrumb__text">
        <h4>Detalle de Venta</h4>
        <div class="breadcrumb__links">
          <span>✨ #{{ route.params.id }}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="shop spad">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading">Cargando...</div>

      <!-- Error -->
      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- Info venta -->
      <div v-if="venta" class="venta-info-card">
        <div class="info-header">
          <h5>Venta #{{ venta.id }}</h5>
          <span class="fecha">{{ new Date(venta.fecha).toLocaleDateString('es-VE') }}</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>Cliente</label>
            <span>{{ venta.cliente?.razonSocial || 'Cliente' }}</span>
          </div>
          <div class="info-item">
            <label>Descuento</label>

            <span v-if="getPorcentajeDescuento() > 0" class="descuento-badge">
              {{ getPorcentajeDescuento() }}% OFF
            </span>

            <span v-if="getPorcentajeDescuento() > 0"> Bs. {{ getDescuentoTotal() }} </span>

            <span v-else class="sin-desc">0%</span>
          </div>
          <div class="info-item">
            <label>Total</label>
            <span class="total-value">Bs. {{ Number(venta.total).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-if="detalles.length > 0" class="detalle-container">
        <h5 class="list-title">📦 Productos</h5>
        <table class="detalle-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detalle in detalles" :key="detalle.id">
              <td>{{ detalle.producto?.nombre || 'Producto' }}</td>
              <td>{{ detalle.cantidad }}</td>
              <td>Bs. {{ Number(detalle.precioUnitario).toFixed(2) }}</td>
              <td class="subtotal">Bs. {{ Number(detalle.subtotal).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="footer-label">Total</td>
              <td class="footer-total">Bs. {{ Number(venta?.total).toFixed(2) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div v-if="!loading && detalles.length === 0 && !error" class="empty-message">
        No hay detalles para esta venta
      </div>

      <div class="volver-section">
        <button class="btn-volver" @click="goBack"><i class="pi pi-arrow-left"></i> Volver</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
}
.breadcrumb__links {
  font-size: 18px;
  color: #ec4899;
  font-weight: 600;
}
.shop {
  padding: 50px 0 80px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.empty-message {
  text-align: center;
  padding: 40px;
  color: #999;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.venta-info-card {
  background: linear-gradient(135deg, #fffafc 0%, #fce7f3 100%);
  border: 2px solid #ec4899;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 25px;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.info-header h5 {
  font-size: 22px;
  font-weight: 700;
  color: #1f1f1f;
}
.fecha {
  color: #666;
  font-weight: 500;
}
.info-grid {
  display: flex;
  gap: 30px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.info-item label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}
.info-item span {
  font-size: 16px;
  color: #1f1f1f;
  font-weight: 500;
}

.descuento-badge {
  background: #22c55e;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 700;
}

.sin-desc {
  color: #999;
  font-size: 14px;
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: #ec4899;
}

.detalle-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
}
.list-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 15px;
}
.detalle-table {
  width: 100%;
  border-collapse: collapse;
}
.detalle-table thead {
  background: #fce7f3;
}
.detalle-table th {
  padding: 15px;
  text-align: left;
  font-weight: 700;
  color: #1f1f1f;
}
.detalle-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.subtotal {
  font-weight: 700;
  color: #ec4899;
}

.desc-item {
  color: #22c55e;
  font-weight: 600;
}

.detalle-table tfoot {
  background: #fffafc;
}
.detalle-table tfoot td {
  padding: 15px;
  border-top: 2px solid #ec4899;
}
.footer-label {
  text-align: right;
  font-weight: 700;
  font-size: 16px;
  color: #1f1f1f;
}
.footer-total {
  font-weight: 700;
  font-size: 18px;
  color: #ec4899;
}

.volver-section {
  margin-top: 25px;
  text-align: center;
}
.btn-volver {
  background: #f5f5f5;
  color: #333;
  border: none;
  padding: 14px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-volver:hover {
  background: #e5e5e5;
}
</style>
