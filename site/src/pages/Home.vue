<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Queen1052</h1>
    <p class="text-gray-600">Welcome to the migrated Vue site. Posts:</p>
    <ul class="mt-4 space-y-2">
      <li v-for="post in posts" :key="post.slug">
        <router-link :to="`/posts/${post.slug}`" class="text-blue-600 hover:underline">{{ post.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '@/posts'

const posts = ref([])

onMounted(async () => {
  posts.value = await getPosts()
})
</script>
