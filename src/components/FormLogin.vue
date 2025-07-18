<template>
    <main class="login-container">
      <div class="login-box">
        <h1 class="uleam-logo">Uleam</h1>
        <p class="uleam-sub">
          UNIVERSIDAD LAICA<br />
          ELOY ALFARO DE MANABÍ
        </p>
  
        <form @submit.prevent="login">
          <input type="email" v-model="correo" placeholder="Correo" required />
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
  
  function login() {
    if (correo.value === 'admin@gmail.com' && clave.value === '1234') {
      localStorage.setItem('usuarioLogueado', correo.value)
      router.push('/materia')
      return
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const user = usuarios.find(u => u.correo === correo.value && u.clave === clave.value)
    if (user) {
      localStorage.setItem('usuarioLogueado', correo.value)
      router.push('/materia')
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
  display: absolute;
  margin-left: 550px;
  width: 600px;
  /* justify-content: center;
  align-items: center; */
  /* height: calc(100vh - 60px); */
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

</style> 