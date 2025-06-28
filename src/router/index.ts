import { createRouter, createWebHistory } from 'vue-router'
import LibreriaMain from '@/views/Libreria-main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LibreriaMain,
    },
  ],
})

export default router
