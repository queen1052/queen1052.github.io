<template>
  <header class="bg-white/60 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/" class="text-xl font-bold">Queen1052</router-link>
        <span class="hidden sm:inline text-sm text-gray-500 dark:text-gray-300">Thoughts on code & markets</span>
      </div>
      <div class="flex items-center gap-4">
        <nav class="hidden md:flex items-center gap-3">
          <router-link to="/" class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary">Home</router-link>
        </nav>
        <DarkToggle />
      </div>
    </div>
  </header>
</template>

<script setup>
import DarkToggle from './DarkToggle.vue'
</script>
