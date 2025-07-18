<template>
  <main class="contenedor-materias">
    <div class="bloque-materias">
      <h2 class="titulo-seccion">Mis Materias</h2>
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
        <div v-for="materia in materiasFiltradas" :key="materia.id" class="tarjeta-materia">
          <h3>{{ materia.nombre }}</h3>
          <p>Cursos: {{ materia.cursos }}</p>
        </div>
        <div v-if="materiasFiltradas.length === 0">No se encontraron materias.</div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

// Ejemplo de materias, reemplaza con tus datos reales o lógica de carga
const materias = ref([
  { id: 1, nombre: 'Matemáticas', cursos: 3 },
  { id: 2, nombre: 'Lengua', cursos: 2 },
  { id: 3, nombre: 'Historia', cursos: 4 },
])

const busqueda = ref('')
const orden = ref('nombre')

const materiasFiltradas = computed(() => {
  let filtradas = materias.value.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  if (orden.value === 'nombre') {
    filtradas = filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre))
  } else if (orden.value === 'cursos') {
    filtradas = filtradas.sort((a, b) => b.cursos - a.cursos)
  }
  return filtradas
})
</script>

<style scoped>
/* ------------------ VISTA MATERIAS ------------------ */

.titulo-seccion {
  color: #c21807;
  margin-bottom: 20px;
  text-align: left;
  font-size: 2rem;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
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