<template>
  <div class="sidebar-overlay" :class="{ active: isOpen }" @click="closeSidebar">
    <div class="sidebar" :class="{ active: isOpen }" @click.stop>
      <div class="sidebar-header">
        <h3>Gestionar Estudiantes</h3>
        <button class="btn-close" @click="closeSidebar">&times;</button>
      </div>

      <div class="sidebar-content">
        <div class="curso-info">
          <p><strong>Curso:</strong> {{ cursoNombre }}</p>
        </div>

        <!-- Formulario para agregar estudiante -->
        <div class="form-section">
          <h4>Agregar Estudiante</h4>
          <form @submit.prevent="agregarEstudiante">
            <div class="form-group">
              <label for="nombreEstudiante">Nombre del Estudiante:</label>
              <input id="nombreEstudiante" type="text" v-model="nuevoEstudiante.nombre"
                placeholder="Ingresa el nombre completo" required />
            </div>
            <button type="submit" class="btn-agregar" :disabled="!nuevoEstudiante.nombre.trim()">
              + Agregar Estudiante
            </button>
          </form>
        </div>

        <!-- Lista de estudiantes existentes -->
        <div class="estudiantes-section">
          <h4>Estudiantes en el curso ({{ estudiantes.length }})</h4>

          <div class="filtro-estudiantes">
            <input type="text" v-model="busquedaEstudiantes" placeholder="Buscar estudiante..." />
          </div>

          <div class="lista-estudiantes">
            <div v-if="estudiantesFiltrados.length === 0" class="no-estudiantes">
              <p v-if="estudiantes.length === 0">No hay estudiantes en este curso</p>
              <p v-else>No se encontraron estudiantes con ese nombre</p>
            </div>

            <div v-for="estudiante in estudiantesFiltrados" :key="estudiante.id" class="estudiante-item">
              <div class="estudiante-info">
                <span class="nombre">{{ estudiante.nombre }}</span>
              </div>
              <button class="btn-eliminar" @click="eliminarEstudiante(estudiante.id)" title="Eliminar estudiante">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Acciones adicionales -->
        <div class="acciones-section">
          <button class="btn-limpiar" @click="limpiarTodos" v-if="estudiantes.length > 0">
            🗑️ Eliminar Todos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cursoNombre: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'estudiantes-updated'])

const estudiantes = ref([])
const busquedaEstudiantes = ref('')
const nuevoEstudiante = ref({
  nombre: ''
})

// Obtener usuario logueado
const getCurrentUser = () => {
  return localStorage.getItem('usuarioLogueado')
}

// Cargar estudiantes desde localStorage
const loadEstudiantes = () => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    estudiantes.value = []
    return
  }

  const userKey = `estudiantes-${currentUser}-${props.cursoNombre}`
  const stored = localStorage.getItem(userKey)
  if (stored) {
    estudiantes.value = JSON.parse(stored)
  } else {
    estudiantes.value = []
  }
}

// Guardar estudiantes en localStorage
const saveEstudiantes = () => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    console.warn('No hay usuario logueado')
    return
  }

  const userKey = `estudiantes-${currentUser}-${props.cursoNombre}`
  localStorage.setItem(userKey, JSON.stringify(estudiantes.value))
  emit('estudiantes-updated', estudiantes.value)
}

// Estudiantes filtrados
const estudiantesFiltrados = computed(() => {
  return estudiantes.value.filter(estudiante =>
    estudiante.nombre.toLowerCase().includes(busquedaEstudiantes.value.toLowerCase())
  )
})

// Funciones
const closeSidebar = () => {
  emit('close')
}

const agregarEstudiante = () => {
  const nombre = nuevoEstudiante.value.nombre.trim()

  if (!nombre) {
    alert('Por favor ingresa un nombre válido')
    return
  }

  // Verificar si ya existe un estudiante con ese nombre
  const existeEstudiante = estudiantes.value.some(
    estudiante => estudiante.nombre.toLowerCase() === nombre.toLowerCase()
  )

  if (existeEstudiante) {
    alert('Ya existe un estudiante con ese nombre en este curso')
    return
  }

  // Agregar nuevo estudiante
  const nuevoId = estudiantes.value.length > 0
    ? Math.max(...estudiantes.value.map(e => e.id)) + 1
    : 1

  estudiantes.value.push({
    id: nuevoId,
    nombre: nombre,
    falta: false,
    tardanza: ''
  })

  // Limpiar formulario
  nuevoEstudiante.value.nombre = ''

  // Guardar cambios
  saveEstudiantes()
}

const eliminarEstudiante = (id) => {
  const estudiante = estudiantes.value.find(e => e.id === id)
  if (estudiante && confirm(`¿Estás seguro de eliminar a ${estudiante.nombre}?`)) {
    estudiantes.value = estudiantes.value.filter(e => e.id !== id)
    saveEstudiantes()
  }
}

const limpiarTodos = () => {
  if (confirm('¿Estás seguro de eliminar todos los estudiantes de este curso?')) {
    estudiantes.value = []
    saveEstudiantes()
  }
}

// Cargar estudiantes cuando cambie el curso
watch(() => props.cursoNombre, () => {
  if (props.cursoNombre) {
    loadEstudiantes()
  }
})

// Cargar estudiantes al montar el componente
onMounted(() => {
  if (props.cursoNombre) {
    loadEstudiantes()
  }
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
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -500px;
  width: 500px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
  z-index: 1001;
}

.sidebar.active {
  right: 0;
}

.sidebar-header {
  background: #c21807;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-content {
  padding: 25px;
}

.curso-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 4px solid #c21807;
}

.curso-info p {
  margin: 0;
  color: #333;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h4 {
  color: #c21807;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #c21807;
  box-shadow: 0 0 0 2px rgba(194, 24, 7, 0.1);
}

.btn-agregar {
  width: 100%;
  background: #c21807;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-agregar:hover:not(:disabled) {
  background: #a01506;
  transform: translateY(-1px);
}

.btn-agregar:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.estudiantes-section {
  margin-bottom: 25px;
}

.estudiantes-section h4 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.filtro-estudiantes {
  margin-bottom: 15px;
}

.filtro-estudiantes input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.lista-estudiantes {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.no-estudiantes {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.no-estudiantes p {
  margin: 0;
}

.estudiante-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s;
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-item:hover {
  background: #f8f9fa;
}

.estudiante-info {
  flex: 1;
}

.nombre {
  font-weight: 500;
  color: #333;
}

.btn-eliminar {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-eliminar:hover {
  background: #f8d7da;
  transform: scale(1.1);
}

.acciones-section {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.btn-limpiar {
  width: 100%;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-limpiar:hover {
  background: #c82333;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    right: -100%;
  }

  .sidebar-content {
    padding: 20px;
  }
}
</style>
