<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const usuario = ref('')
const clave = ref('')
const error = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(usuario.value, clave.value).catch(() => (error.value = true))
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo -->
      <div class="login-logo">
        <img src="@/assets/img/ze_da_logo.jpeg" alt="Ze & Da" />
      </div>
      
      <!-- Título -->
      <h1 class="login-title">Bienvenida</h1>
      <p class="login-subtitle">✨ Inicia sesión en tu cuenta ✨</p>
      
      <!-- Formulario -->
      <form class="login-form" @submit.prevent="onSubmit">
        <!-- Usuario -->
        <div class="form-group">
          <label class="form-label">Usuario</label>
          <div class="input-wrapper">
            <i class="pi pi-user"></i>
            <input 
              v-model="usuario" 
              type="text" 
              class="form-input" 
              placeholder="Ingresa tu usuario" 
              autofocus 
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <div class="input-wrapper">
            <i class="pi pi-lock"></i>
            <input 
              v-model="clave" 
              type="password" 
              class="form-input" 
              placeholder="Ingresa tu contraseña" 
            />
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          Usuario y/o contraseña incorrectos
        </p>

        <!-- Botón -->
        <button type="submit" class="form-submit">
          <i class="pi pi-sign-in"></i>
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Container principal */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fffafc 0%, #fce7f3 50%, #fdf2f8 100%);
  padding: 20px;
}

/* Box del login */
.login-box {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(236, 72, 153, 0.15);
  border: 2px solid #fce7f3;
}

/* Logo */
.login-logo {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ec4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Título */
.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0 0 5px 0;
}

/* Subtítulo */
.login-subtitle {
  text-align: center;
  font-size: 14px;
  color: #ec4899;
  font-weight: 500;
  margin: 0 0 30px 0;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Grupo */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Label */
.form-label {
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
  font-size: 14px;
}

/* Input wrapper */
.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ec4899;
  font-size: 16px;
}

/* Input */
.form-input {
  width: 100%;
  padding: 14px 15px 14px 45px;
  border: 2px solid #fce7f3;
  border-radius: 12px;
  font-size: 14px;
  background: #fffafc;
  transition: all 0.3s ease;
  color: #333;
}

.form-input:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  outline: none;
  background: white;
}

.form-input::placeholder {
  color: #999;
}

/* Error */
.error-message {
  color: #dc2626;
  background: #fee2e2;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.error-message i {
  font-size: 16px;
}

/* Botón submit */
.form-submit {
  background: linear-gradient(45deg, #ec4899, #db2777);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.form-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.form-submit:active {
  transform: translateY(0);
}
</style>