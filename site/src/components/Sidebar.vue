<template>
  <aside class="w-72 hidden lg:block border-r border-gray-200 bg-white">
    <div class="p-6">
      <div class="text-lg font-semibold mb-4">Categories</div>
      <ul class="space-y-2 text-sm text-gray-700">
        <li v-for="cat in categories" :key="cat">{{ cat }}</li>
      </ul>
    </div>
    <div class="p-6 border-t">
      <div class="text-sm text-gray-500">Recent posts</div>
      <ul class="mt-3 space-y-2">
        <li v-for="p in recent" :key="p.slug">
          <router-link :to="`/posts/${p.slug}`" class="text-blue-600 hover:underline">{{ p.title }}</router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { getPosts } from '@/posts'
import { ref, onMounted } from 'vue'

const posts = ref([])
onMounted(async () => {
  posts.value = await getPosts()
})

const categories = computed(() => {
  // naive extraction from posts' frontmatter if present; fallback list
  const cats = new Set()
  posts.value.forEach(p => {
    if (p.meta && p.meta.categories) {
      const arr = String(p.meta.categories).replace(/\[|\]|\s/g, '').split(',')
      arr.forEach(c => c && cats.add(c))
    }
  })
  if (!cats.size) {
    return ['Blog']
  }
  return Array.from(cats)
})

const recent = computed(() => posts.value.slice(0, 6))
</script>
