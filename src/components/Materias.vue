<template>
  <main class="contenedor-materias">
    <div class="bloque-materias">
      <div class="header-section">
        <h2 class="titulo-seccion">Mis Materias</h2>
        <button class="btn-agregar" @click="openSidebar">
          + Gestionar Materias
        </button>
      </div>

      <div class="filtros">
        <input type="text" v-model="busqueda" placeholder="Buscar materia..." />
        <select v-model="orden">
          <option value="nombre">Ordenar por nombre</option>
          <option value="cursos">Ordenar por cantidad de cursos</option>
        </select>
      </div>

      <div class="grid-materias">
        <div v-for="materia in materiasFiltradas" :key="materia.id" class="tarjeta-materia"
          :class="{ expanded: materia.expanded }" @click="toggleMateria(materia)">
          <div class="materia-header">
            <h3>{{ materia.nombre }}</h3>
            <div class="materia-stats">
              <span class="curso-count">{{ materia.cursos.length }} curso(s)</span>
              <span class="expand-icon" :class="{ rotated: materia.expanded }">▼</span>
            </div>
          </div>

          <div v-if="materia.expanded" class="cursos-list">
            <div v-if="materia.cursos.length === 0" class="no-cursos">
              No hay cursos en esta materia
            </div>
            <div v-for="curso in materia.cursos" :key="curso.id" class="curso-item" @click.stop>
              <div class="curso-info">
                <h4>{{ curso.nombre }}</h4>
              </div>
              <button class="btn-asistencia" @click="tomarAsistencia(curso)">
                Tomar Asistencia
              </button>
            </div>
          </div>
        </div>

        <div v-if="materiasFiltradas.length === 0" class="estado-vacio">
          <div class="icono-vacio">📚</div>
          <h3>No hay materias</h3>
          <p>Comienza agregando tu primera materia</p>
          <button class="btn-agregar-vacio" @click="openSidebar">
            + Agregar Materia
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Component -->
    <SidebarMaterias :is-open="sidebarOpen" @close="closeSidebar" @materias-updated="handleMateriasUpdated" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarMaterias from './SidebarMaterias.vue'

const materias = ref([])
const busqueda = ref('')
const orden = ref('nombre')
const sidebarOpen = ref(false)
const router = useRouter()

// Obtener usuario logueado
const getCurrentUser = () => {
  return localStorage.getItem('usuarioLogueado')
}

// Cargar materias desde localStorage por usuario
const loadMaterias = () => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    materias.value = []
    return
  }

  const userKey = `materias-asistencia-${currentUser}`
  const stored = localStorage.getItem(userKey)
  if (stored) {
    materias.value = JSON.parse(stored)
  } else {
    materias.value = []
  }
}

// Guardar materias en localStorage por usuario
const saveMaterias = () => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    console.warn('No hay usuario logueado')
    return
  }

  const userKey = `materias-asistencia-${currentUser}`
  localStorage.setItem(userKey, JSON.stringify(materias.value))
}

const materiasFiltradas = computed(() => {
  let filtradas = materias.value.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  if (orden.value === 'nombre') {
    filtradas = filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre))
  } else if (orden.value === 'cursos') {
    filtradas = filtradas.sort((a, b) => b.cursos.length - a.cursos.length)
  }
  return filtradas
})

// Funciones del sidebar
const openSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleMateriasUpdated = (nuevasMaterias) => {
  materias.value = nuevasMaterias
}

// Funciones de interacción
const toggleMateria = (materia) => {
  materia.expanded = !materia.expanded
  saveMaterias()
}

const tomarAsistencia = (curso) => {
  router.push({ name: 'curso', params: { nombre: curso.nombre } })
}

onMounted(() => {
  loadMaterias()
})
</script>

<style scoped>
/* ------------------ VISTA MATERIAS RESPONSIVE ------------------ */

.contenedor-materias {
  padding: clamp(8px, 2vw, 20px);
  max-width: 1400px;
  margin: 0 auto;
}

.bloque-materias {
  background-color: white;
  padding: clamp(16px, 4vw, 30px);
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: clamp(20px, 5vw, 90px) auto;
  min-height: 60vh;
  overflow-y: auto;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(16px, 3vw, 20px);
  flex-wrap: wrap;
  gap: clamp(10px, 2vw, 15px);
}

.titulo-seccion {
  color: #c21807;
  margin: 0;
  font-size: clamp(1.2rem, 4vw, 2rem);
}

.btn-agregar {
  background: #c21807;
  color: white;
  border: none;
  padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  min-height: 44px;
}

.btn-agregar:hover {
  background: #a01506;
  transform: translateY(-1px);
}

/* Filtros */
.filtros {
  display: flex;
  gap: clamp(8px, 2vw, 10px);
  margin-bottom: clamp(16px, 3vw, 20px);
  flex-wrap: wrap;
}

.filtros input,
.filtros select {
  padding: clamp(8px, 2vw, 10px);
  font-size: clamp(0.9rem, 2vw, 1rem);
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 140px;
  flex: 1 1 160px;
  min-height: 44px;
}

/* Grid */
.grid-materias {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: clamp(12px, 3vw, 20px);
}

/* Tarjetas */
.tarjeta-materia {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tarjeta-materia:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tarjeta-materia.expanded {
  border-color: #c21807;
}

.tarjeta-materia .materia-header {
  background: #f8f9fa;
  padding: clamp(12px, 3vw, 15px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.tarjeta-materia.expanded .materia-header {
  background: #c21807;
  color: white;
}

.tarjeta-materia .materia-header h3 {
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.tarjeta-materia.expanded .materia-header h3 {
  color: white;
}

.materia-stats {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 10px);
  flex-shrink: 0;
}

.curso-count {
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: #666;
}

.tarjeta-materia.expanded .curso-count {
  color: rgba(255, 255, 255, 0.9);
}

.expand-icon {
  font-size: 12px;
  transition: transform 0.2s;
  color: #666;
}

.tarjeta-materia.expanded .expand-icon {
  color: white;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* Cursos */
.cursos-list {
  padding: clamp(12px, 3vw, 15px);
  background: #f8f9fa;
}

.no-cursos {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: clamp(16px, 4vw, 20px);
}

.curso-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: clamp(10px, 2.5vw, 12px);
  margin-bottom: clamp(8px, 2vw, 10px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s;
  gap: 10px;
}

.curso-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.curso-item:last-child {
  margin-bottom: 0;
}

.curso-info {
  flex: 1;
}

.curso-info h4 {
  margin: 0 0 4px 0;
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #333;
}

.curso-info p {
  margin: 0;
  font-size: clamp(0.8rem, 1.8vw, 0.85rem);
  color: #666;
}

.btn-asistencia {
  background: #28a745;
  color: white;
  border: none;
  padding: clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px);
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.8vw, 0.85rem);
  font-weight: 500;
  transition: all 0.2s;
  min-height: 36px;
  flex-shrink: 0;
}

.btn-asistencia:hover {
  background: #218838;
  transform: scale(1.05);
}

/* Estado vacío */
.estado-vacio {
  grid-column: 1 / -1;
  text-align: center;
  padding: clamp(40px, 8vw, 60px) clamp(16px, 4vw, 20px);
  color: #666;
}

.icono-vacio {
  font-size: clamp(3rem, 8vw, 4rem);
  margin-bottom: clamp(16px, 4vw, 20px);
}

.estado-vacio h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
}

.estado-vacio p {
  margin: 0 0 clamp(20px, 5vw, 30px) 0;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
}

.btn-agregar-vacio {
  background: #c21807;
  color: white;
  border: none;
  padding: clamp(12px, 3vw, 15px) clamp(24px, 5vw, 30px);
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  font-weight: 500;
  transition: all 0.2s;
}

.btn-agregar-vacio:hover {
  background: #a01506;
  transform: translateY(-2px);
}

/* Tarjetas adicionales */
.materia-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.materia-card:hover {
  transform: scale(1.02);
}

.materia-header {
  background-color: #7a7d82;
  color: white;
  padding: clamp(8px, 2vw, 10px);
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.materia-cursos {
  padding: clamp(8px, 2vw, 10px);
  color: #333;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.btn-curso {
  display: block;
  width: 100%;
  margin-top: clamp(6px, 1.5vw, 8px);
  padding: clamp(8px, 2vw, 10px);
  background-color: #e1e1e1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-weight: bold;
  font-size: clamp(0.9rem, 2vw, 1rem);
  transition: background-color 0.2s;
  min-height: 44px;
}

.btn-curso:hover {
  background-color: #d5d5d5;
}

/* Media queries esenciales */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-agregar {
    width: 100%;
  }

  .filtros {
    flex-direction: column;
  }

  .filtros input,
  .filtros select {
    width: 100%;
    flex: none;
  }

  .grid-materias {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .curso-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .grid-materias {
    grid-template-columns: 1fr;
  }

  .materia-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .materia-stats {
    width: 100%;
    justify-content: space-between;
  }

  .btn-asistencia {
    width: 100%;
    text-align: center;
  }
}
</style>