<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto p-6">
      <article class="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <button @click="$router.push('/')" class="text-sm text-gray-500 mb-2">← Back</button>
        <h1 class="text-4xl font-bold mb-2">{{ post.title }}</h1>
        <p class="text-sm text-gray-500 mb-6">{{ post.meta?.date || '' }}</p>
        <div v-html="htmlContent"></div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getPosts } from '@/posts'
import { ref, onMounted } from 'vue'
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug
const post = ref(null)
const htmlContent = ref('')

onMounted(async () => {
  const all = await getPosts()
  post.value = all.find(p => p.slug === slug)
  if (post.value) {
    htmlContent.value = marked.parse(post.value.content)
  }
})
</script>
