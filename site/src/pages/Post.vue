<template>
  <div class="container mx-auto p-6">
    <div v-if="post">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <div v-html="post.content" class="prose"></div>
    </div>
    <div v-else>
      <p>Post not found.</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getPosts } from '@/posts'
import { ref, onMounted } from 'vue'

const route = useRoute()
const slug = route.params.slug
const post = ref(null)

onMounted(async () => {
  const all = await getPosts()
  post.value = all.find(p => p.slug === slug)
})
</script>
