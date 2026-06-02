import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    empleado: localStorage.getItem('empleado') || '',
    token: getTokenFromLocalStorage(),
    returnUrl: null || ''
  }),
  getters: {},
  actions: {
    async login(usuario: string, clave: string) {
      await http.post('auth/login', { usuario, clave }).then((response) => {
        this.empleado = response.data.usuario
        this.token = response.data.access_token

        localStorage.setItem('empleado', this.empleado || '')
        localStorage.setItem('token', this.token || '')

        router.push(this.returnUrl || '/')
      })
    },
    logout() {
      localStorage.clear()
      this.$reset()
      router.push('login')
    }
  }
})

export { useAuthStore }