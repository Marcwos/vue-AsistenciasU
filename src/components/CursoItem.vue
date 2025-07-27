<template>
  <div class="curso-item">
    <div class="curso-info">
      <h6>{{ curso.nombre }}</h6>
    </div>
    <div class="curso-actions">
      <button class="btn-asistencia" @click="tomarAsistencia" title="Tomar asistencia">
        📋
      </button>
      <button class="btn-delete" @click="confirmDelete" title="Eliminar curso">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  curso: {
    type: Object,
    required: true
  },
  materiaId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['delete-curso'])

const confirmDelete = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar el curso "${props.curso.nombre}"?`)) {
    emit('delete-curso', props.curso.id)
  }
}

const tomarAsistencia = () => {
  // Funcionalidad futura para tomar asistencia
  alert(`Funcionalidad de asistencia para "${props.curso.nombre}" próximamente...`)
}
</script>

<style scoped>
.curso-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s;
}

.curso-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.curso-info h6 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 0.9rem;
}



.curso-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-asistencia {
  background: #28a745;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  color: white;
}

.btn-asistencia:hover {
  background: #218838;
  transform: scale(1.05);
}

.btn-delete {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #ffebee;
  transform: scale(1.1);
}
</style>
