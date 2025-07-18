import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

import FormRegister from '../components/FormRegister.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: FormRegister,
    },
  ],
})

export default router
