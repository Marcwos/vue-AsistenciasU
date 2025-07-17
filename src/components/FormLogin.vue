<template>
    <main class="login-container">
      <div class="login-box">
        <h1 class="uleam-logo">Uleam</h1>
        <p class="uleam-sub">
          UNIVERSIDAD LAICA<br />
          ELOY ALFARO DE MANABÍ
        </p>
  
        <form @submit.prevent="login">
          <input type="text" v-model="usuario" placeholder="Nombre usuario" required />
          <input type="password" v-model="clave" placeholder="Contraseña" required />
          <button type="submit">Ingresar</button><br />
          <a href="#" class="olvide">¿Olvidó contraseña?</a>
        </form>
      </div>
    </main>
  </template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const usuario = ref('')
  const clave = ref('')
  const router = useRouter()
  
  function login() {
    if (usuario.value === 'admin' && clave.value === '1234') {
      localStorage.setItem('usuarioLogueado', usuario.value)
      router.push('/materia')
    } else {
      alert('Credenciales incorrectas')
    }
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