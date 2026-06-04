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
      <div class="header__top">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-7">
              <div class="header__top__left">
                <p>✨ Moda y estilo al alcance ✨</p>
              </div>
            </div>
            <div class="col-lg-6 col-md-5">
              <div class="header__top__right">
                <div class="header__top__links">
                  <RouterLink to="/login" v-if="!authStore.token" class="login-link">
                    <i class="pi pi-sign-in"></i> Iniciar Sesión
                  </RouterLink>
                  <a v-else @click="logout()" class="logout-link">
                    <i class="pi pi-sign-out"></i> Salir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-3">
            <div class="header__logo">
              <RouterLink to="/">
                <img src="@/assets/img/ze_logo_largo.jpeg" alt="Ze & Da" class="logo-img" />
              </RouterLink>
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
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
  </div>
</template>

<style scoped>

.logo-img {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
}

.nav-link {
  position: relative;
  color: #1f1f1f;
  font-weight: 500;
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
