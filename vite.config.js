import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Serem_portfolio/',
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
        }
      }
    }
  },
})
