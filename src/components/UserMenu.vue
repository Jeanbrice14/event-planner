<!-- src/components/UserMenu.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios'
import { showError, showSuccess } from '@/helper/notyf.ts'

const authStore = useAuthStore();
const router = useRouter();

const dropdownOpen = ref(false);
const baseHostName = import.meta.env.VITE_API_URL as string;
const profileUrl = baseHostName + '/user/profile';
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

async function logout() {
  try {
    const response = await axios.post('/api/auth/logout');
    authStore.logout();
    router.push('/login');
    showSuccess('Successfully logged out');
  } catch (err: any) {
    showError('Operation fail');
  }
}

const user = authStore.user as any;
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- Avatar Button -->
    <button @click="toggleDropdown" class="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full">
      <img
        :src="user?.profile_photo_url"
        alt="User avatar"
        class="w-10 h-10 rounded-full border border-gray-100 cursor-pointer"
      />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="dropdownOpen"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-gray-100 ring-opacity-5 focus:outline-none z-50"
      >
        <div class="py-3 px-4 border-b border-gray-100">
          <p class="font-semibold text-gray-800">{{ user?.name }}</p>
          <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
        </div>
        <div class="py-1">
          <a :href="profileUrl" target="_blank" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Profile
          </a>
          <a :href="profileUrl"  target="_blank" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Settings
          </a>
        </div>
        <div class="py-1 border-t border-gray-100">
          <button
            @click="logout"
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
