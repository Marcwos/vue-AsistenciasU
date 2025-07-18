<template>
  <main class="login-container">
    <div class="login-box">
      <h1 class="uleam-logo">Uleam</h1>
      <p class="uleam-sub">
        UNIVERSIDAD LAICA<br />
        ELOY ALFARO DE MANABÍ
      </p>
      <h2 style="color: #4CAF50; font-weight: bold;">Registrar Usuario</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="Nombres" placeholder="Nombres" required />
        <input type="text" v-model="Apellidos" placeholder="Apellidos" required />
        <input type="text" v-model="correo" placeholder="Correo" required />
        <input type="password" v-model="clave" placeholder="Contraseña" required />
        <input type="password" v-model="confirmarClave" placeholder="Confirmar Contraseña" required />
        <button type="submit">Registrar</button><br />
        <a href="#" class="volver" @click.prevent="volverLogin">¿Ya tienes cuenta? Ingresar</a>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const Nombres = ref('')
const Apellidos = ref('')
const correo = ref('')
const clave = ref('')
const confirmarClave = ref('')
const router = useRouter()

function register() {
  if (!Nombres.value || !Apellidos.value || !correo.value || !clave.value || !confirmarClave.value) {
    alert('Por favor, complete todos los campos')
    return
  }
  let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
  if (usuarios.find(u => u.correo === correo.value)) {
    alert('El correo ya existe')
    return
  }
  if (confirmarClave.value !== clave.value) {
    alert('Las contraseñas no coinciden')
    return
  }
  usuarios.push({ Nombres: Nombres.value, Apellidos: Apellidos.value, correo: correo.value, clave: clave.value })
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  alert('Usuario registrado exitosamente')
  router.push('/login')
}

function volverLogin() {
  router.push('/login')
}
</script>

<style scoped>

/* ------------------ REGISTER ------------------ */
.login-container {
  display: absolute;
  margin-left: 430px;
  width: 600px;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: 60px auto;
}

.login-box form {
  text-align: left;
}

.uleam-logo {
  color: #c21807;
  font-size: 32px;
  font-weight: bold;
}

.uleam-sub {
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.4;
  color: #555;
}

.register-box h2 {
  margin-bottom: 20px;
  color: #1976d2;
}

.login-box input {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.login-box .volver {
  display: inline-block;
  margin-top: 10px;
  color: #1976d2;
  text-decoration: none;
  cursor: pointer;
  font-size: 12px;
}
</style>
