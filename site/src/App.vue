<template>
  <SiteHeader />
  <router-view />
  <footer class="bg-gray-100 mt-12 py-8">
    <div class="container mx-auto text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Queen1052</div>
  </footer>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
</script>
