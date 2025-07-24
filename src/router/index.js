import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import FormRegister from '../components/FormRegister.vue'
import MateriasView from '@/views/MateriasView.vue'
import CursoView from '@/views/CursoView.vue'

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
    {
      path: '/materias',
      name: 'materias',
      component: MateriasView,
    },
    {
      path: '/curso/:nombre',
      name: 'curso',
      component: CursoView,
      props: true
    }
  ],
})

export default router
