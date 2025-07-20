// stores/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null
  }),
  getters: {
    isAuthenticated: (state: any) => !!state.token,
  },
  actions: {
    login(loginResponse: any){
      console.log(loginResponse);
      this.setToken(loginResponse.token);
      this.user = loginResponse.user;
    },
    logout(){
      this.setToken('');
      this.user = null
    },
    setToken(token: string) {
      this.token = token;
    },
    clearToken() {
      this.token = '';
    },
  },
});
