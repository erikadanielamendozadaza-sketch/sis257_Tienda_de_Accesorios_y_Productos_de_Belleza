<script setup lang="ts">
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const proveedorListRef = ref<typeof ProveedorList | null>(null)
const proveedorEdit = ref<any>(null)

function handleCreate() {
  proveedorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(proveedor: any) {
  proveedorEdit.value = proveedor
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
  proveedorEdit.value = null
}

function handleGuardar() {
  proveedorListRef.value?.obtenerLista()
  mostrarDialog.value = false
  proveedorEdit.value = null
}
</script>

<template>
  <!-- Encabezado ROSADO con Logo -->
  <section class="breadcrumb-option">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb__text">
            <h4>Proveedores</h4>
            <div class="breadcrumb__links">
              <span>✨ Administración de proveedores ✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contenido -->
  <section class="shop spad">
    <div class="container">
      <!-- Header con Logo -->
      <div class="crud-header">
        <!-- Logo a la izquierda -->
        <div class="header-logo">
          <img src="@/assets/img/ze_da_logo.jpeg" alt="Ze & Da" class="logo-img" />
        </div>
        
        <div class="header-content">
          <h3>Lista de Proveedores</h3>
          <p>✨ Gestiona los proveedores registrados en el sistema ✨</p>
        </div>

        <Button 
          label="Nuevo Proveedor" 
          icon="pi pi-plus" 
          class="btn-rosa"
          @click="handleCreate" 
        />
      </div>

      <!-- Container crema -->
      <div class="crud-container">
        <ProveedorList ref="proveedorListRef" @edit="handleEdit" />
      </div>

      <!-- Save -->
      <ProveedorSave
        :mostrar="mostrarDialog"
        :proveedor="proveedorEdit"
        :modoEdicion="!!proveedorEdit"
        @guardar="handleGuardar"
        @close="handleCloseDialog"
      />
    </div>
  </section>
</template>

<style scoped>
/* Breadcrumb */
.breadcrumb-option {
  padding-top: 50px;
  padding-bottom: 30px;
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

/* Shop */
.shop {
  padding: 50px 0 80px;
}

/* Header */
.crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  gap: 20px;
}

/* Logo */
.header-logo {
  flex-shrink: 0;
}

.logo-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 50%;
  border: 3px solid #ec4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Contenido header */
.header-content {
  flex: 1;
}

.crud-header h3 {
  font-size: 32px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #1f1f1f, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.crud-header p {
  color: #ec4899;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* Container crema */
.crud-container {
  background: #fffafc;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
  border: 1px solid #fce7f3;
}

/* Botón rosa */
.btn-rosa {
  background: #ec4899 !important;
  border-color: #ec4899 !important;
  color: white !important;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-size: 15px;
}

.btn-rosa:hover {
  background: #db2777 !important;
  border-color: #db2777 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}
</style>