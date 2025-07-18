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
        <input type="email" v-model="correo" placeholder="Correo" required />
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
/* ------------------ RESPONSIVE REGISTER ------------------ */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.login-box form {
  text-align: left;
}

.uleam-logo {
  color: #c21807;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.uleam-sub {
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.4;
  color: #555;
}

.login-box h2 {
  margin-bottom: 20px;
  color: #4CAF50;
}

.login-box input {
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

.login-box button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.login-box button:hover {
  background-color: #45a049;
}

.login-box .volver {
  display: inline-block;
  margin-top: 15px;
  color: #1976d2;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.login-box .volver:hover {
  text-decoration: underline;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }
  
  .login-box {
    padding: 30px 25px;
    max-width: 350px;
  }
  
  .uleam-logo {
    font-size: 28px;
  }
  
  .uleam-sub {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-box {
    padding: 25px 20px;
    max-width: 320px;
  }
  
  .uleam-logo {
    font-size: 24px;
  }
  
  .uleam-sub {
    font-size: 12px;
  }
  
  .login-box input,
  .login-box button {
    padding: 10px;
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .login-box {
    padding: 20px 15px;
    max-width: 300px;
  }
  
  .uleam-logo {
    font-size: 22px;
  }
  
  .login-box input,
  .login-box button {
    padding: 8px;
    font-size: 14px;
  }
}
</style>