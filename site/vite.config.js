import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [vue({ include: [/\.vue$/, /\.md$/] }), Markdown()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
