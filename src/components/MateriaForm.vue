<template>
  <div class="materia-form">
    <h4>Agregar Nueva Materia</h4>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nombreMateria">Nombre de la Materia</label>
        <input
          id="nombreMateria"
          type="text"
          v-model="formData.nombre"
          placeholder="Ej: Matemáticas, Historia..."
          required
        />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="!formData.nombre.trim()">
          Agregar Materia
        </button>
        <button type="button" class="btn-secondary" @click="resetForm">
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['materia-added'])

const formData = ref({
  nombre: ''
})

const submitForm = () => {
  if (formData.value.nombre.trim()) {
    emit('materia-added', {
      nombre: formData.value.nombre.trim()
    })
    resetForm()
  }
}

const resetForm = () => {
  formData.value.nombre = ''
}
</script>

<style scoped>
.materia-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.materia-form h4 {
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
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
</style>
