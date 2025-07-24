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
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar materia..."
        />
        <select v-model="orden">
          <option value="nombre">Ordenar por nombre</option>
          <option value="cursos">Ordenar por cantidad de cursos</option>
        </select>
      </div>
      
      <div class="grid-materias">
        <div 
          v-for="materia in materiasFiltradas" 
          :key="materia.id" 
          class="tarjeta-materia"
          :class="{ expanded: materia.expanded }"
          @click="toggleMateria(materia)"
        >
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
            <div 
              v-for="curso in materia.cursos" 
              :key="curso.id" 
              class="curso-item"
              @click.stop
            >
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
    <SidebarMaterias 
      :is-open="sidebarOpen" 
      @close="closeSidebar"
      @materias-updated="handleMateriasUpdated"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SidebarMaterias from './SidebarMaterias.vue'

const materias = ref([])
const busqueda = ref('')
const orden = ref('nombre')
const sidebarOpen = ref(false)

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
  alert(`Funcionalidad de asistencia para "${curso.nombre}" próximamente...`)
}

onMounted(() => {
  loadMaterias()
})
</script>

<style scoped>
/* ------------------ VISTA MATERIAS ------------------ */

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.titulo-seccion {
  color: #c21807;
  margin: 0;
  text-align: left;
  font-size: 2rem;
}

.btn-agregar {
  background: #c21807;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-agregar:hover {
  background: #a01506;
  transform: translateY(-1px);
}

.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filtros input,
.filtros select {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 140px;
  flex: 1 1 160px;
}

.grid-materias {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

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
  padding: 15px;
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
  font-size: 1.1rem;
  color: #333;
}

.tarjeta-materia.expanded .materia-header h3 {
  color: white;
}

.materia-stats {
  display: flex;
  align-items: center;
  gap: 10px;
}

.curso-count {
  font-size: 0.9rem;
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

.cursos-list {
  padding: 15px;
  background: #f8f9fa;
}

.no-cursos {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.curso-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.curso-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.curso-item:last-child {
  margin-bottom: 0;
}

.curso-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #333;
}

.curso-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.btn-asistencia {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-asistencia:hover {
  background: #218838;
  transform: scale(1.05);
}

.estado-vacio {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.icono-vacio {
  font-size: 4rem;
  margin-bottom: 20px;
}

.estado-vacio h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.estado-vacio p {
  margin: 0 0 30px 0;
  font-size: 1.1rem;
}

.btn-agregar-vacio {
  background: #c21807;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-agregar-vacio:hover {
  background: #a01506;
  transform: translateY(-2px);
}

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
  padding: 10px;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.materia-cursos {
  padding: 10px;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
}

.bloque-materias {
  background-color: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  max-width: 100%;
  margin: 0 auto;
  height: 75vh;
  overflow-y: auto;
  margin: 90px;
}

.btn-curso {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background-color: #e1e1e1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-curso:hover {
  background-color: #d5d5d5;
}

/* Responsive design */
@media (max-width: 1024px) {
  .bloque-materias {
    padding: 16px 8px;
    margin: 30px 0;
    height: auto;
  }
  .titulo-seccion {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .contenedor-materias {
    padding: 8px;
    margin: 0;
  }
  .bloque-materias {
    padding: 12px 2vw;
    margin: 20px 0;
    border-radius: 8px;
    height: auto;
  }
  .grid-materias {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }
  .titulo-seccion {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .contenedor-materias {
    padding: 4px;
    margin: 0;
  }
  .bloque-materias {
    padding: 8px 0.5vw;
    margin: 8px 0;
    border-radius: 6px;
    height: auto;
  }
  .filtros {
    flex-direction: column;
    gap: 6px;
  }
  .filtros input,
  .filtros select {
    min-width: unset;
    width: 100%;
    font-size: 0.95rem;
  }
  .grid-materias {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .materia-card {
    padding: 8px 4px;
  }
  .titulo-seccion {
    font-size: 1rem;
  }
}
</style>