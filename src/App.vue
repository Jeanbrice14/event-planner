<!-- src/App.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import UserMenu from '@/components/UserMenu.vue';

const auth = useAuthStore();
</script>

<template>
  <header class="bg-white shadow-sm py-4 z-10 relative">
    <div class="container mx-auto px-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Event Planner</h1>

      <!-- If authenticated, show UserMenu -->
      <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
        <UserMenu />
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 flex items-center justify-center">
    <router-view/>
  </main>
</template>

<style scoped>
main {
  min-height: calc(100vh - 4rem); /* Adjust for header height */
  background-color: #f9fafb; /* Tailwind's gray-50 */
}
</style>
