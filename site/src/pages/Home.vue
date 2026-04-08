<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar />
    <main class="flex-1">
      <div class="container mx-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">Queen1052</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Thoughtful notes on code & markets</p>
        </div>

        <section class="section-light">
          <div class="container-980 hero-center mb-8">
            <h1 class="display-hero">Queen1052</h1>
            <p class="body-text text-gray-600 dark:text-gray-300">Thoughtful notes on code & markets</p>
            <div class="mt-6 flex gap-3">
              <router-link to="/about" class="btn-pill">Learn more</router-link>
              <router-link to="/" class="btn-apple">Subscribe</router-link>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostCard v-for="post in posts" :key="post.slug" :card="post" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '@/posts'
import Sidebar from '@/components/Sidebar.vue'
import PostCard from '@/components/PostCard.vue'

const posts = ref([])

onMounted(async () => {
  posts.value = await getPosts()
})
</script>
