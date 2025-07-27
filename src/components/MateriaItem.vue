<template>
  <div class="materia-item">
    <div class="materia-header" @click="toggleExpanded">
      <div class="materia-info">
        <h5>{{ materia.nombre }}</h5>
        <span class="curso-count">{{ materia.cursos.length }} curso(s)</span>
      </div>
      <div class="materia-actions">
        <button class="btn-expand" :class="{ expanded: materia.expanded }" @click.stop="toggleExpanded">
          ▼
        </button>
        <button class="btn-delete" @click.stop="confirmDelete" title="Eliminar materia">
          🗑️
        </button>
      </div>
    </div>

    <div v-if="materia.expanded" class="cursos-container">
      <div v-if="materia.cursos.length === 0" class="no-cursos">
        No hay cursos en esta materia
      </div>
      <CursoItem v-for="curso in materia.cursos" :key="curso.id" :curso="curso" :materia-id="materia.id"
        @delete-curso="handleDeleteCurso" />
    </div>
  </div>
</template>

<script setup>
import CursoItem from './CursoItem.vue'

const props = defineProps({
  materia: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete-materia', 'delete-curso'])

const toggleExpanded = () => {
  props.materia.expanded = !props.materia.expanded
}

const confirmDelete = () => {
  const hasCoursesMessage = props.materia.cursos.length > 0
    ? `\n\nEsta materia tiene ${props.materia.cursos.length} curso(s) que también serán eliminados.`
    : ''

  if (confirm(`¿Estás seguro de que quieres eliminar la materia "${props.materia.nombre}"?${hasCoursesMessage}`)) {
    emit('delete-materia', props.materia.id)
  }
}

const handleDeleteCurso = (cursoId) => {
  emit('delete-curso', props.materia.id, cursoId)
}
</script>

<style scoped>
.materia-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  overflow: hidden;
}

.materia-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.materia-header:hover {
  background: #f8f9fa;
}

.materia-info h5 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1rem;
}

.curso-count {
  font-size: 0.85rem;
  color: #666;
}

.materia-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-expand {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
  color: #666;
}

.btn-expand:hover {
  background: #e9ecef;
}

.btn-expand.expanded {
  transform: rotate(180deg);
}

.btn-delete {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #ffebee;
  transform: scale(1.1);
}

.cursos-container {
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  padding: 10px;
}

.no-cursos {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}
</style>
