<template>
  <div class="sidebar-overlay" v-if="isOpen" @click="closeSidebar">
    <div class="sidebar" @click.stop>
      <div class="sidebar-header">
        <h3>Gestión de Materias</h3>
        <button class="btn-close" @click="closeSidebar">×</button>
      </div>
      
      <div class="sidebar-content">
        <!-- Tabs para alternar entre materias y cursos -->
        <div class="tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'materias' }"
            @click="activeTab = 'materias'"
          >
            Materias
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'cursos' }"
            @click="activeTab = 'cursos'"
          >
            Cursos
          </button>
        </div>

        <!-- Contenido de Materias -->
        <div v-if="activeTab === 'materias'" class="tab-content">
          <MateriaForm @materia-added="handleMateriaAdded" />
          <div class="materias-list">
            <h4>Materias Existentes</h4>
            <MateriaItem 
              v-for="materia in materias" 
              :key="materia.id"
              :materia="materia"
              @delete-materia="handleDeleteMateria"
              @delete-curso="handleDeleteCurso"
            />
            <div v-if="materias.length === 0" class="empty-state">
              No hay materias creadas
            </div>
          </div>
        </div>

        <!-- Contenido de Cursos -->
        <div v-if="activeTab === 'cursos'" class="tab-content">
          <CursoForm 
            :materias="materias"
            @curso-added="handleCursoAdded" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MateriaForm from './MateriaForm.vue'
import CursoForm from './CursoForm.vue'
import MateriaItem from './MateriaItem.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'materias-updated'])

const activeTab = ref('materias')
const materias = ref([])

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
  emit('materias-updated', materias.value)
}

// Manejar agregar materia
const handleMateriaAdded = (nuevaMateria) => {
  const materia = {
    id: Date.now(),
    nombre: nuevaMateria.nombre,
    expanded: false,
    cursos: []
  }
  materias.value.push(materia)
  saveMaterias()
}

// Manejar eliminar materia
const handleDeleteMateria = (materiaId) => {
  materias.value = materias.value.filter(m => m.id !== materiaId)
  saveMaterias()
}

// Manejar agregar curso
const handleCursoAdded = (nuevoCurso) => {
  const materia = materias.value.find(m => m.id === nuevoCurso.materiaId)
  if (materia) {
    const curso = {
      id: Date.now(),
      nombre: nuevoCurso.nombre
    }
    materia.cursos.push(curso)
    saveMaterias()
  }
}

// Manejar eliminar curso
const handleDeleteCurso = (materiaId, cursoId) => {
  const materia = materias.value.find(m => m.id === materiaId)
  if (materia) {
    materia.cursos = materia.cursos.filter(c => c.id !== cursoId)
    saveMaterias()
  }
}

// Cerrar sidebar
const closeSidebar = () => {
  emit('close')
}

onMounted(() => {
  loadMaterias()
})
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.sidebar {
  width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #c21807;
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  background: white;
  color: #c21807;
  border-bottom: 2px solid #c21807;
}

.tab-content {
  padding: 20px;
}

.materias-list {
  margin-top: 30px;
}

.materias-list h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
  }
}
</style>
