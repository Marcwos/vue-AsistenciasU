<template>
    <main class="login-container">
      <div class="login-box">
        <h1 class="uleam-logo">Uleam</h1>
        <p class="uleam-sub">
          UNIVERSIDAD LAICA<br />
          ELOY ALFARO DE MANABÍ
        </p>
  
        <form @submit.prevent="login">
          <input v-focus type="email" v-model="correo" placeholder="Correo" required />
          <input type="password" v-model="clave" placeholder="Contraseña" required />
          <button type="submit">Ingresar</button><br />
          <a href="#" class="olvide">¿Olvidó contraseña?</a>
          <a href="#" class="registro" @click.prevent="goToRegister">¿No tienes cuenta? Regístrate</a>
        </form>
      </div>
    </main>
  </template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const correo = ref('')
  const clave = ref('')
  const router = useRouter()

  const vFocus = {
    mounted: (el) => el.focus()
  }
  
  function login() {
    if (correo.value === 'admin@gmail.com' && clave.value === '1234') {
      localStorage.setItem('usuarioLogueado', correo.value)
      // Disparar evento para que el navbar se actualice
      window.dispatchEvent(new Event('authStatusChanged'))
      router.push('/materias')
      return
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const user = usuarios.find(u => u.correo === correo.value && u.clave === clave.value)
    if (user) {
      localStorage.setItem('usuarioLogueado', correo.value)
      // Disparar evento para que el navbar se actualice
      window.dispatchEvent(new Event('authStatusChanged'))
      router.push('/materias')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  function goToRegister() {
    router.push('/register')
  }
</script>

<style scoped>
/* ------------------ LOGIN ------------------ */
.login-container {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  margin: 0;
  padding: 0;
}

.registro {
  display: inline-block;
  margin-top: 10px;
  color: #1976d2;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
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

.olvide {
  font-size: 12px;
  color: #666;
  text-decoration: none;
}

/* Responsive styles */
@media (max-width: 600px) {
  .login-container {
    padding: 10px;
    min-height: 100vh;
    width: 100vw;
    margin: 0;
  }
  .login-box {
    padding: 20px 10px;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  .uleam-logo {
    font-size: 26px;
  }
  .uleam-sub {
    font-size: 12px;
  }
  .login-box form input,
  .login-box form button {
    font-size: 14px;
    width: 100%;
    margin-bottom: 10px;
  }
}

@media (max-width: 350px) {
  .login-box {
    padding: 8px 2px;
  }
}
</style>