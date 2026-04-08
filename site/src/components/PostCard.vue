<template>
  <article class="card-apple rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
    <img :src="card.image" alt="" class="w-full h-40 object-cover">
    <div class="p-4">
      <router-link :to="`/posts/${card.slug}`" class="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary">{{ card.title }}</router-link>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ card.excerpt }}</p>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{{ card.readTime }}</span>
        <div class="flex gap-2">
          <span v-for="t in card.tags" :key="t" class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">{{ t }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({ card: Object })
</script>
