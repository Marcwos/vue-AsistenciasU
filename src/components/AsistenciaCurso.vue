<template>
  <main class="contenedor-asistencia">
    <div class="bloque-asistencia">
      <div class="header-section">
        <div class="curso-info">
          <button class="btn-volver" @click="volverMaterias">
            ← Volver a Materias
          </button>
          <h2 class="titulo-curso">{{ nombreCurso }}</h2>
          <p class="fecha-actual">{{ fechaActual }}</p>
        </div>
        <button class="btn-agregar-estudiante" @click="openSidebar">
          + Agregar Estudiante
        </button>
      </div>

      <div class="filtros">
        <div class="filtros-izquierda">
          <input type="text" v-model="busqueda" placeholder="Buscar estudiante..." class="input-busqueda" />
          <div class="selector-fecha">
            <label for="fecha-consulta">Ver asistencia del:</label>
            <input type="date" id="fecha-consulta" v-model="fechaConsulta" @change="cargarAsistenciaFecha"
              class="input-fecha" />
          </div>
        </div>
        <div class="filtros-derecha">
          <button v-if="!modoConsulta" class="btn-guardar-asistencia" @click="guardarAsistencia"
            :disabled="asistenciaGuardadaHoy">
            💾 {{ asistenciaGuardadaHoy ? 'Asistencia Guardada' : 'Guardar Asistencia' }}
          </button>
          <button v-if="asistenciaGuardadaHoy && !modoConsulta" class="btn-editar-asistencia" @click="editarAsistencia">
            ✏️ Editar Asistencia
          </button>
          <button v-if="modoConsulta" class="btn-volver-hoy" @click="volverAsistenciaHoy">
            📅 Volver a Hoy
          </button>
        </div>
      </div>

      <div class="tabla-asistencia">
        <div v-if="estudiantesFiltrados.length === 0" class="estado-vacio">
          <div class="icono-vacio">👥</div>
          <h3>No hay estudiantes</h3>
          <p>Comienza agregando estudiantes a este curso</p>
          <button class="btn-agregar-vacio" @click="openSidebar">
            + Agregar Estudiante
          </button>
        </div>

        <table v-else class="tabla">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Falta</th>
              <th>Tardanza</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="estudiante in estudiantesFiltrados" :key="estudiante.id">
              <td class="nombre-estudiante">{{ estudiante.nombre }}</td>
              <td class="celda-falta">
                <input type="checkbox" v-model="estudiante.falta" @change="actualizarEstado(estudiante)"
                  class="checkbox-falta" :disabled="modoConsulta" />
              </td>
              <td class="celda-tardanza">
                <select v-model="estudiante.tardanza" :disabled="estudiante.falta || modoConsulta"
                  class="select-tardanza" @change="actualizarEstado(estudiante)">
                  <option value="">Sin tardanza</option>
                  <option value="5min">5 min</option>
                  <option value="10min">10 min</option>
                  <option value="20min">20 min</option>
                  <option value="+30min">+30 min</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="estudiantesFiltrados.length > 0" class="resumen-asistencia">
        <div class="estadistica">
          <span class="numero">{{ estudiantesPresentes }}</span>
          <span class="etiqueta">Presentes</span>
        </div>
        <div class="estadistica">
          <span class="numero">{{ estudiantesAusentes }}</span>
          <span class="etiqueta">Ausentes</span>
        </div>
        <div class="estadistica">
          <span class="numero">{{ estudiantesTardios }}</span>
          <span class="etiqueta">Tardíos</span>
        </div>
      </div>
    </div>

    <!-- Sidebar para agregar estudiantes -->
    <SidebarEstudiantes :is-open="sidebarOpen" :curso-nombre="nombreCurso" @close="closeSidebar"
      @estudiantes-updated="handleEstudiantesUpdated" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarEstudiantes from './SidebarEstudiantes.vue'

const props = defineProps({
  nombreCurso: {
    type: String,
    required: true
  }
})

const router = useRouter()
const estudiantes = ref([])
const busqueda = ref('')
const sidebarOpen = ref(false)
const fechaConsulta = ref('')
const modoConsulta = ref(false)
const asistenciaGuardadaHoy = ref(false)
const estudiantesOriginales = ref([])

// Fecha actual formateada
const fechaActual = computed(() => {
  const fecha = new Date()
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

  const userKey = `estudiantes-${currentUser}-${props.nombreCurso}`
  const stored = localStorage.getItem(userKey)
  if (stored) {
    estudiantes.value = JSON.parse(stored)
  } else {
    // Inicializar con lista vacía
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

  const userKey = `estudiantes-${currentUser}-${props.nombreCurso}`
  localStorage.setItem(userKey, JSON.stringify(estudiantes.value))
}

// Estudiantes filtrados por búsqueda
const estudiantesFiltrados = computed(() => {
  return estudiantes.value.filter(estudiante =>
    estudiante.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

// Estadísticas
const estudiantesPresentes = computed(() => {
  return estudiantes.value.filter(e => !e.falta && !e.tardanza).length
})

const estudiantesAusentes = computed(() => {
  return estudiantes.value.filter(e => e.falta).length
})

const estudiantesTardios = computed(() => {
  return estudiantes.value.filter(e => !e.falta && e.tardanza).length
})

// Funciones
const volverMaterias = () => {
  router.push({ name: 'materias' })
}

const openSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleEstudiantesUpdated = (nuevosEstudiantes) => {
  estudiantes.value = nuevosEstudiantes
}

const actualizarEstado = (estudiante) => {
  if (estudiante.falta) {
    estudiante.tardanza = ''
  }
  saveEstudiantes()
}

const guardarAsistencia = () => {
  const fecha = new Date().toLocaleDateString('es-ES')
  const asistenciaData = {
    curso: props.nombreCurso,
    fecha: fecha,
    estudiantes: estudiantes.value.map(e => ({
      nombre: e.nombre,
      estado: e.falta ? 'ausente' : (e.tardanza ? `tardío (${e.tardanza})` : 'presente')
    }))
  }

  const currentUser = getCurrentUser()
  const historialKey = `historial-asistencia-${currentUser}`
  const historial = JSON.parse(localStorage.getItem(historialKey) || '[]')

  // Verificar si ya existe asistencia para hoy
  const asistenciaHoyIndex = historial.findIndex(a => a.fecha === fecha && a.curso === props.nombreCurso)

  if (asistenciaHoyIndex >= 0) {
    // Actualizar asistencia existente
    historial[asistenciaHoyIndex] = asistenciaData
  } else {
    // Agregar nueva asistencia
    historial.push(asistenciaData)
  }

  localStorage.setItem(historialKey, JSON.stringify(historial))
  asistenciaGuardadaHoy.value = true

  alert('Asistencia guardada correctamente')
}

const cargarAsistenciaFecha = () => {
  if (!fechaConsulta.value) {
    volverAsistenciaHoy()
    return
  }

  const currentUser = getCurrentUser()
  const historialKey = `historial-asistencia-${currentUser}`
  const historial = JSON.parse(localStorage.getItem(historialKey) || '[]')

  const fechaSeleccionada = new Date(fechaConsulta.value).toLocaleDateString('es-ES')
  const asistenciaFecha = historial.find(a => a.fecha === fechaSeleccionada && a.curso === props.nombreCurso)

  if (asistenciaFecha) {
    modoConsulta.value = true
    // Cargar estudiantes con su asistencia de esa fecha
    const estudiantesConAsistencia = estudiantesOriginales.value.map(estudiante => {
      const asistenciaEstudiante = asistenciaFecha.estudiantes.find(a => a.nombre === estudiante.nombre)
      if (asistenciaEstudiante) {
        return {
          ...estudiante,
          falta: asistenciaEstudiante.estado === 'ausente',
          tardanza: asistenciaEstudiante.estado.includes('tardío') ?
            asistenciaEstudiante.estado.match(/\((.+)\)/)?.[1] || '' : ''
        }
      }
      return {
        ...estudiante,
        falta: false,
        tardanza: ''
      }
    })
    estudiantes.value = estudiantesConAsistencia
  } else {
    modoConsulta.value = true
    // No hay asistencia para esta fecha, mostrar estudiantes sin marcar
    estudiantes.value = estudiantesOriginales.value.map(e => ({
      ...e,
      falta: false,
      tardanza: ''
    }))
  }
}

const volverAsistenciaHoy = () => {
  modoConsulta.value = false
  fechaConsulta.value = ''
  // Restaurar estudiantes originales
  estudiantes.value = [...estudiantesOriginales.value]
  // Verificar si ya hay asistencia guardada hoy
  verificarAsistenciaHoy()
}

const editarAsistencia = () => {
  asistenciaGuardadaHoy.value = false
  alert('Ahora puedes editar la asistencia y guardar los cambios')
}

const verificarAsistenciaHoy = () => {
  const fecha = new Date().toLocaleDateString('es-ES')
  const currentUser = getCurrentUser()
  const historialKey = `historial-asistencia-${currentUser}`
  const historial = JSON.parse(localStorage.getItem(historialKey) || '[]')

  const asistenciaHoy = historial.find(a => a.fecha === fecha && a.curso === props.nombreCurso)
  asistenciaGuardadaHoy.value = !!asistenciaHoy

  if (asistenciaHoy) {
    // Cargar la asistencia del día actual
    const estudiantesConAsistencia = estudiantes.value.map(estudiante => {
      const asistenciaEstudiante = asistenciaHoy.estudiantes.find(a => a.nombre === estudiante.nombre)
      if (asistenciaEstudiante) {
        return {
          ...estudiante,
          falta: asistenciaEstudiante.estado === 'ausente',
          tardanza: asistenciaEstudiante.estado.includes('tardío') ?
            asistenciaEstudiante.estado.match(/\((.+)\)/)?.[1] || '' : ''
        }
      }
      return estudiante
    })
    estudiantes.value = estudiantesConAsistencia
  }
}

onMounted(() => {
  loadEstudiantes()
  estudiantesOriginales.value = [...estudiantes.value]
  verificarAsistenciaHoy()
})
</script>

<style scoped>
.contenedor-asistencia {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.bloque-asistencia {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.curso-info {
  flex: 1;
}

.btn-volver {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.btn-volver:hover {
  background: #5a6268;
  transform: translateX(-2px);
}

.titulo-curso {
  color: #c21807;
  margin: 0 0 5px 0;
  font-size: 2.2rem;
  font-weight: 600;
}

.fecha-actual {
  color: #666;
  margin: 0;
  font-size: 1rem;
  text-transform: capitalize;
}

.btn-agregar-estudiante {
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

.btn-agregar-estudiante:hover {
  background: #a01506;
  transform: translateY(-1px);
}

.filtros {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;
}

.filtros-izquierda {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}

.filtros-derecha {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.input-busqueda {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.selector-fecha {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.selector-fecha label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.input-fecha {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}



.btn-guardar-asistencia {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-guardar-asistencia:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.btn-guardar-asistencia:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.btn-editar-asistencia {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-editar-asistencia:hover {
  background: #e0a800;
  transform: translateY(-1px);
}

.btn-volver-hoy {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-volver-hoy:hover {
  background: #138496;
  transform: translateY(-1px);
}

.tabla-asistencia {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tabla th {
  background: #c21807;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
}

.tabla td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
}

.tabla tr:last-child td {
  border-bottom: none;
}

.tabla tr:hover {
  background: #f8f9fa;
}

.nombre-estudiante {
  font-weight: 500;
  color: #333;
}

.celda-falta {
  text-align: center;
  width: 100px;
}

.celda-tardanza {
  width: 150px;
}

.checkbox-falta {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.select-tardanza {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.select-tardanza:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.estado-vacio {
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
  margin: 0 0 25px 0;
}

.btn-agregar-vacio {
  background: #c21807;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-agregar-vacio:hover {
  background: #a01506;
  transform: translateY(-1px);
}

.resumen-asistencia {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.estadistica {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 120px;
}

.numero {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #c21807;
  margin-bottom: 5px;
}

.etiqueta {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .bloque-asistencia {
    padding: 20px;
    margin: 10px;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .titulo-curso {
    font-size: 1.8rem;
  }

  .tabla {
    font-size: 0.9rem;
  }

  .tabla th,
  .tabla td {
    padding: 10px 8px;
  }

  .resumen-asistencia {
    gap: 15px;
  }

  .estadistica {
    min-width: 100px;
    padding: 15px;
  }
}
</style>
