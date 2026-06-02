<script setup lang="ts">
import ProductoList from '@/components/producto/ProductoList.vue'
import ProductoSave from '@/components/producto/ProductoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const productoListRef = ref<typeof ProductoList | null>(null)
const productoEdit = ref<any>(null)

function handleCreate() {
  productoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(producto: any) {
  productoEdit.value = producto
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  productoListRef.value?.obtenerLista()
}
</script>

<template>
  <!-- Encabezado -->
  <section class="breadcrumb-option">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb__text">
            <h4>Productos</h4>
            <div class="breadcrumb__links">
              <span>Administración de productos de belleza y accesorios</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contenido -->
  <section class="shop spad">
    <div class="container">
      <div class="crud-header">
        <div>
          <h3>Inventario de Productos</h3>
          <p>Gestiona los productos registrados en el sistema.</p>
        </div>

        <Button label="Nuevo Producto" icon="pi pi-plus" severity="success" @click="handleCreate" />
      </div>

      <div class="crud-container">
        <ProductoList ref="productoListRef" @edit="handleEdit" />
      </div>

      <ProductoSave
        :mostrar="mostrarDialog"
        :producto="productoEdit"
        :modoEdicion="!!productoEdit"
        @guardar="handleGuardar"
        @close="handleCloseDialog"
      />
    </div>
  </section>
</template>

<style scoped>
.crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.crud-header h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.crud-header p {
  color: #666;
  margin: 0;
}

.crud-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}
</style>
