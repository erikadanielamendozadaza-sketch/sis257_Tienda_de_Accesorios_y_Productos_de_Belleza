<script setup lang="ts">
import { useAuthStore } from '@/stores/index.ts'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <div class="offcanvas-menu-overlay"></div>
    <div class="offcanvas-menu-wrapper">
      <div class="offcanvas__option">
        <div class="offcanvas__links">
          <a href="#">Sign in</a>
          <a href="#">FAQs</a>
        </div>
        <div class="offcanvas__top__hover">
          <span>Usd <i class="arrow_carrot-down"></i></span>
          <ul>
            <li>USD</li>
            <li>EUR</li>
            <li>USD</li>
          </ul>
        </div>
      </div>
      <div class="offcanvas__nav__option">
        <a href="#" class="search-switch"><img src="@/assets/img/icon/search.png" alt="" /></a>
        <a href="#"><img src="@/assets/img/icon/heart.png" alt="" /></a>
        <a href="#"><img src="@/assets/img/icon/cart.png" alt="" /> <span>0</span></a>
        <div class="price">$0.00</div>
      </div>
      <div id="mobile-menu-wrap"></div>
      <div class="offcanvas__text">
        <p>Free shipping, 30-day return or refund guarantee.</p>
      </div>
    </div>
    <header class="header">
      <div class="header__top">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-7">
              <div class="header__top__left">
                <p>Free shipping, 30-day return or refund guarantee.</p>
              </div>
            </div>
            <div class="col-lg-6 col-md-5">
              <div class="header__top__right">
                <div class="header__top__links">
                  <a href="#">Sign in</a>
                  <a href="#">FAQs</a>
                </div>
                <div class="header__top__hover">
                  <span>Usd <i class="arrow_carrot-down"></i></span>
                  <ul>
                    <li>USD</li>
                    <li>EUR</li>
                    <li>USD</li>
                  </ul>
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
              <a href="./index.html"><img src="@/assets/img/logo.png" alt="" /></a>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <nav class="header__menu mobile-menu">
              <ul>
                <li class="active">
                  <RouterLink to="/">Inicio</RouterLink>
                </li>

                <li>
                  <RouterLink to="/productos">Productos</RouterLink>
                </li>

                <li>
                  <RouterLink to="/clientes">Clientes</RouterLink>
                </li>

                <li>
                  <RouterLink to="/proveedores">Proveedores</RouterLink>
                </li>

                <li>
                  <RouterLink to="/about">Acerca de</RouterLink>
                </li>

                <li v-if="!authStore.token">
                  <RouterLink to="/login">Iniciar Sesión</RouterLink>
                </li>
              </ul>
            </nav>
          </div>
          <div class="col-lg-3 col-md-3">
            <div class="header__nav__option">
              <a href="#" class="search-switch"
                ><img src="@/assets/img/icon/search.png" alt=""
              /></a>
              <a href="#"><img src="@/assets/img/icon/heart.png" alt="" /></a>
              <a href="#"><img src="@/assets/img/icon/cart.png" alt="" /> <span>0</span></a>
              <div class="price">$0.00</div>
            </div>
          </div>
        </div>
        <div class="canvas__open"><i class="fa fa-bars"></i></div>
      </div>
    </header>
    <!-- Search Begin -->
    <div class="search-model">
      <div class="h-100 d-flex align-items-center justify-content-center">
        <div class="search-close-switch">+</div>
        <form class="search-model-form">
          <input type="text" id="search-input" placeholder="Search here....." />
        </form>
      </div>
    </div>
    <!-- Search End -->
  </div>
</template>

<style scoped></style>
