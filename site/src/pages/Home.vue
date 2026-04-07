<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main class="flex-1">
      <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-4">Queen1052</h1>
        <p class="text-gray-600">Welcome to the migrated Vue site. Posts:</p>
        <ul class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <li v-for="post in posts" :key="post.slug" class="bg-white p-4 rounded shadow">
            <router-link :to="`/posts/${post.slug}`" class="text-xl text-blue-600 hover:underline">{{ post.title }}</router-link>
            <p class="text-sm text-gray-500 mt-2">{{ post.meta?.date || '' }}</p>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '@/posts'
import Sidebar from '@/components/Sidebar.vue'

const posts = ref([])

onMounted(async () => {
  posts.value = await getPosts()
})
</script>
