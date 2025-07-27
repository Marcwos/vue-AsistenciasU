<template>
  <header class="encabezado">
    <!-- Logo/Avatar y nombre -->
    <div class="logo-section">
      <div class="avatar-circle">
        <img src="@/assets/favicon_ULEAM_2.ico" alt="Logo ULEAM">
      </div>
      <span class="nombre-uleam">ULEAM</span>
    </div>

    <!-- Navegación tipo pestañas cuando el usuario está logueado -->
    <nav v-if="isLoggedIn" class="nav-tabs">
      <RouterLink to="/materias" class="tab-link" :class="{ active: currentSection === 'materias' }">
        Materias
      </RouterLink>
      <RouterLink v-if="showCursoTab" to="/curso/:nombre" class="tab-link"
        :class="{ active: currentSection === 'curso' }">
        Cursos
      </RouterLink>
      <!-- Botón de salir -->
      <button @click="logout" class="btn-salir">
        Salir
      </button>
    </nav>

    <!-- Navegación cuando el usuario NO está logueado -->
    <div v-else class="acceder">
      <RouterLink to="/register" class="btn-register">Registrarse</RouterLink>
      <RouterLink to="/login" class="btn-login">Iniciar Sesión</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estado de autenticación
const isLoggedIn = ref(false)
const currentSection = ref('materias') // Por defecto "materias" está activo como en la imagen
const showCursoTab = ref(false) // Controla si mostrar la pestaña Cursos

// Función para cerrar sesión
const logout = () => {
  // Limpiar datos de sesión
  localStorage.removeItem('usuarioLogueado')
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login')
}

// Función para verificar el estado de autenticación
const checkAuthStatus = () => {
  // Verifica si hay un usuario logueado (coincide con FormLogin.vue)
  const usuario = localStorage.getItem('usuarioLogueado')
  isLoggedIn.value = !!usuario
}

// Función para actualizar la sección actual
const updateCurrentSection = () => {
  const path = route.path
  if (path.includes('/materias')) {
    currentSection.value = 'materias'
    showCursoTab.value = false // Ocultar pestaña Cursos en vista de materias
  } else if (path.includes('/curso')) {
    currentSection.value = 'curso'
    showCursoTab.value = true // Mostrar pestaña Cursos cuando estés en un curso
  } else {
    currentSection.value = ''
    showCursoTab.value = false // Ocultar en otras rutas
  }
}

// Función para simular login (puedes llamarla desde otros componentes)
const login = () => {
  isLoggedIn.value = true
}

// Exponer funciones para uso externo
defineExpose({
  login,
  logout,
  checkAuthStatus
})

// Verificar estado al montar el componente
onMounted(() => {
  checkAuthStatus()
  updateCurrentSection()

  // Escuchar cambios en localStorage para detectar login/logout
  window.addEventListener('storage', (e) => {
    if (e.key === 'usuarioLogueado') {
      checkAuthStatus()
    }
  })

  // También escuchar eventos personalizados para cambios en la misma pestaña
  window.addEventListener('authStatusChanged', () => {
    checkAuthStatus()
  })
})

// Observar cambios de ruta
watch(() => route.path, () => {
  updateCurrentSection()
})
</script>

<style scoped>
/* ------------------ ENCABEZADO ------------------ */
.encabezado {
  width: 100%;
  background-color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px;
}

/* ------------------ LOGO/AVATAR SECTION ------------------ */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  background-color: #4a4a4a;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #888;
  overflow: hidden;
}

.avatar-circle img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 50%;
}

.avatar-icon {
  font-size: 20px;
  color: #ccc;
}

.nombre-uleam {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* ------------------ NAVEGACIÓN TIPO PESTAÑAS ------------------ */
.nav-tabs {
  display: flex;
  align-items: stretch;
  gap: 0;
  height: 100%;
}

.tab-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  height: 100%;
  background-color: #666;
  border-right: 1px solid #555;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.tab-link:hover {
  background-color: #777;
  color: white;
}

.tab-link.active {
  background-color: #e74c3c;
  color: white;
  font-weight: 600;
}

/* ------------------ BOTÓN SALIR ------------------ */
.btn-salir {
  background-color: #666;
  color: #ccc;
  border: none;
  border-left: 1px solid #555;
  border-radius: 0;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  outline: none;
  margin: 0;
}

.btn-salir:hover {
  background-color: #777;
  color: white;
}

.btn-salir:focus {
  outline: none;
}

/* ------------------ NAVEGACIÓN NO LOGUEADO ------------------ */
.acceder {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
}

.btn-register,
.btn-login {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn-register:hover,
.btn-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* ------------------ RESPONSIVE ------------------ */
@media (max-width: 768px) {
  .encabezado {
    flex-direction: column;
    height: auto;
  }

  .nav-tabs {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .nav-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-link {
    min-width: 120px;
  }

  .nombre-uleam {
    font-size: 16px;
  }
}

/* Agregar margen al body para compensar el header fijo */
body {
  margin-top: 60px;
}
</style>