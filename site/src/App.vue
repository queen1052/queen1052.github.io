<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <SiteHeader />
    <div class="pt-6">
      <router-view />
    </div>
    <footer class="bg-transparent mt-12 py-8">
      <div class="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">© {{ new Date().getFullYear() }} Queen1052</div>
    </footer>
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
</script>
