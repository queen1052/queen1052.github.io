import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import Prism from './plugins/prism'

const app = createApp(App)
app.use(router)
app.provide('Prism', Prism)
app.mount('#app')
