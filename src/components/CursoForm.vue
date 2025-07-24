<template>
  <div class="curso-form">
    <h4>Agregar Nuevo Curso</h4>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="materiaSelect">Seleccionar Materia</label>
        <select
          id="materiaSelect"
          v-model="formData.materiaId"
          required
        >
          <option value="">-- Selecciona una materia --</option>
          <option 
            v-for="materia in materias" 
            :key="materia.id" 
            :value="materia.id"
          >
            {{ materia.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="nombreCurso">Nombre del Curso</label>
        <input
          id="nombreCurso"
          type="text"
          v-model="formData.nombre"
          placeholder="Ej: Curso A, Paralelo 1..."
          required
        />
      </div>


      
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="!formData.nombre.trim() || !formData.materiaId"
        >
          Agregar Curso
        </button>
        <button type="button" class="btn-secondary" @click="resetForm">
          Limpiar
        </button>
      </div>
    </form>

    <div v-if="materias.length === 0" class="no-materias">
      <p>⚠️ Primero debes crear al menos una materia para poder agregar cursos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  materias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['curso-added'])

const formData = ref({
  materiaId: '',
  nombre: ''
})

const submitForm = () => {
  if (formData.value.nombre.trim() && formData.value.materiaId) {
    emit('curso-added', {
      materiaId: formData.value.materiaId,
      nombre: formData.value.nombre.trim()
    })
    resetForm()
  }
}

const resetForm = () => {
  formData.value.materiaId = ''
  formData.value.nombre = ''
}
</script>

<style scoped>
.curso-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.curso-form h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #c21807;
  box-shadow: 0 0 0 2px rgba(194, 24, 7, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  background: #c21807;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: #a01506;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.no-materias {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.no-materias p {
  margin: 0;
  color: #856404;
  text-align: center;
}
</style>
