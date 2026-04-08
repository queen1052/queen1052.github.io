import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Post from '@/pages/Post.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/posts/:slug', component: Post, props: true },
]

export default createRouter({
  history: createWebHistory('/'),
  routes,
})
