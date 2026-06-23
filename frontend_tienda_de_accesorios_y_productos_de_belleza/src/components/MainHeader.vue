<script setup lang="ts">
import { useAuthStore } from '@/stores/index.ts'
import { RouterLink, useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <div class="offcanvas-menu-overlay"></div>
    <div class="offcanvas-menu-wrapper">
      <div class="offcanvas__option">
        <div class="offcanvas__links">
          <RouterLink to="/login" v-if="!authStore.token">Iniciar Sesión</RouterLink>
        </div>
      </div>
      <div id="mobile-menu-wrap"></div>
      <div class="offcanvas__text">
        <p>✨ Tu tienda de belleza favorita ✨</p>
      </div>
    </div>

    <header class="header">
      <div class="container">
        <div class="row">
          <div class="col-lg-2 col-md-2">
            <div class="header__logo">
              <RouterLink to="/">
                <img src="@/assets/img/ze_logo_largo.jpeg" alt="Ze & Da" class="logo-img" />
              </RouterLink>
            </div>
          </div>

          <div class="col-lg-10 col-md-10">
            <nav class="header__menu mobile-menu">
              <ul>
                <li>
                  <RouterLink to="/" class="nav-link">Inicio</RouterLink>
                </li>

                <li v-if="authStore.token">
                  <RouterLink to="/productos" class="nav-link">Productos</RouterLink>
                </li>
                <li v-if="authStore.token">
                  <RouterLink to="/clientes" class="nav-link">Clientes</RouterLink>
                </li>
                <li v-if="authStore.token">
                  <RouterLink to="/proveedores" class="nav-link">Proveedores</RouterLink>
                </li>
                <li v-if="authStore.token">
                  <RouterLink to="/ventas" class="nav-link">Ventas</RouterLink>
                </li>
                <li v-if="authStore.token">
                  <RouterLink to="/historial-ventas" class="nav-link">Detalle de Venta</RouterLink>
                </li>
                <li v-if="authStore.token">
                  <a @click="logout()" class="nav-link logout-nav"> Cerrar Sesión </a>
                </li>

                <li v-if="!authStore.token">
                  <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="canvas__open"><i class="fa fa-bars"></i></div>
      </div>
    </header>

    <div class="header-space"></div>

  </div>
</template>

<style scoped>

.logout-nav {
  background: #ec4899;
  color: white !important;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.header__logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: -100px;
}

.header__menu ul {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
}
.header__menu li {
  white-space: nowrap;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
}

.header-space {
  height: 55px;
}

.logo-img {
  max-width: 140px;
  width: 100%;
  height: auto;
}

.nav-link {
  position: relative;
  color: #1f1f1f;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 15px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ec4899;
}

.nav-link.router-link-active {
  color: #ec4899;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #ec4899;
  border-radius: 2px;
}

.login-link {
  color: #ec4899 !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.login-link:hover {
  color: #db2777 !important;
}

.logout-link {
  color: #666 !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.logout-link:hover {
  color: #ec4899 !important;
}
</style>
