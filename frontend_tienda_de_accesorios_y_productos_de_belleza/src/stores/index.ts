import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => {
    // Obtener empleado del localStorage de forma segura
    let empleadoLocal = null
    const empStorage = localStorage.getItem('empleado')
    
    // Solo parsear si es JSON válido
    if (empStorage && empStorage.startsWith('{')) {
      try {
        empleadoLocal = JSON.parse(empStorage)
      } catch {
        empleadoLocal = null
      }
    }
    
    return {
      empleado: empleadoLocal,
      token: getTokenFromLocalStorage(),
      returnUrl: null || ''
    }
  },
  getters: {},
  actions: {
    async login(usuario: string, clave: string) {
      await http.post('auth/login', { usuario, clave }).then((response) => {
        this.empleado = response.data.usuario
        this.token = response.data.access_token

        localStorage.setItem('empleado', JSON.stringify(response.data.usuario))
        localStorage.setItem('token', this.token || '')

        router.push(this.returnUrl || '/')
      })
    },
    logout() {
      localStorage.removeItem('empleado')
      localStorage.removeItem('token')
      this.empleado = null
      this.token = ''
      router.push('/login')
    }
  }
})

export { useAuthStore }