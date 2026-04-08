<template>
  <button @click="toggle" class="p-2 rounded focus:outline-none" :aria-pressed="isDark">
    <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM15.66 4.34a1 1 0 010 1.41l-.71.7a1 1 0 01-1.41-1.41l.7-.7a1 1 0 011.42 0zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM15.66 15.66a1 1 0 01-1.41 0l-.7-.71a1 1 0 011.41-1.41l.7.7a1 1 0 010 1.42zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 15.66a1 1 0 010-1.42l.7-.7a1 1 0 011.41 1.41l-.71.71a1 1 0 01-1.4 0zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zM5.05 4.34a1 1 0 011.41 0l.7.7A1 1 0 015.82 6.45l-.7-.7a1 1 0 010-1.41z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('site:theme')
  if (saved) {
    isDark.value = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  } else {
    // default dark
    isDark.value = true
    document.documentElement.classList.add('dark')
    localStorage.setItem('site:theme', 'dark')
  }
})

function toggle() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('site:theme', isDark.value ? 'dark' : 'light')
}
</script>
