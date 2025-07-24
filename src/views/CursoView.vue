<template>
  <Navbar :cursoNombre="nombreCurso" />
  <AsistenciaCurso :nombreCurso="nombreCurso" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import AsistenciaCurso from '../components/AsistenciaCurso.vue'

const route = useRoute()
const nombreCurso = route.params.nombre
</script>

<style scoped>
    
</style>