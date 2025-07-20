import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import axios from 'axios';
import './assets/main.css';
import { useAuthStore } from '@/stores/auth.ts'

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized response
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  config => {
    const authStore = useAuthStore()

    if (authStore.isAuthenticated) {
      const token = authStore.token
      if (token.length) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

const app = createApp(App);

const pinia = createPinia();

pinia.use(({ store }) => {
  // Load initial state from localStorage
  const savedState = localStorage.getItem(store.$id);
  if (savedState) {
    store.$patch(JSON.parse(savedState));
  }

  // Subscribe to state changes
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
});

app.use(pinia);
app.use(router);

app.mount('#app');

