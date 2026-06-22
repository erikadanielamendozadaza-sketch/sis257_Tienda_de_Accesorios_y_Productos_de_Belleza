<script setup lang="ts">
import { RouterView } from 'vue-router'

import MainHeader from '@/components/MainHeader.vue'
import MainFooter from '@/components/MainFooter.vue'
</script>

<template>
  <main>
    <MainHeader />

    <RouterView />
  </main>

  <MainFooter />
</template>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/font-awesome.min.css';
@import '@/assets/css/elegant-icons.css';
@import '@/assets/css/magnific-popup.css';
@import '@/assets/css/nice-select.css';
@import '@/assets/css/owl.carousel.min.css';
@import '@/assets/css/slicknav.min.css';
@import '@/assets/css/style.css';
</style>
