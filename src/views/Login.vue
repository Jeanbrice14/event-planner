<!-- src/views/Login.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts'
import { showSuccess } from '@/helper/notyf.ts'

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false);
const error = ref<string | null>(null);

const baseHostName = import.meta.env.VITE_API_URL as string;
const signupUrl = baseHostName + '/register';

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.post<{ data: { token: string } }>('/api/auth/login', {
      email: form.value.email,
      password: form.value.password
    });
    authStore.login(response.data.data);
    router.push({name: 'home'});
    const user = authStore.user as any;
    showSuccess('Welcome back ' + user.name);
  } catch (err: any) {
    console.log(err);
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
    <!-- Left Illustration Section -->
    <div class="hidden md:flex items-center justify-center bg-gray-50 p-8">
      <img
        src="../assets/undraw_events_0w4f.svg"
        alt="Login Illustration"
        class="max-w-md w-full h-auto object-contain"
      />
    </div>

    <!-- Right Login Form Section -->
    <div class="flex items-center justify-center p-8">
      <div class="w-full max-w-md space-y-6">
        <h2 class="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
        <p class="text-center text-gray-500">Please login to your account</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else>Loading...</span>
          </button>
          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>
        </form>

        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <a :href="signupUrl" class="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>
