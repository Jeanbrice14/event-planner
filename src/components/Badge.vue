<!-- src/components/Badge.vue -->
<script setup lang="ts">
import { computed } from 'vue';

// Define the allowed badge types
type BadgeType = 'warning' | 'primary' | 'error' | 'success' | 'info';

// Define props with TypeScript
defineProps<{
  type?: BadgeType; // Optional, defaults to 'info'
  text: string;
}>();

// Default type if not provided
const defaultType: BadgeType = 'info';

// Compute Tailwind classes based on the badge type
function badgeClasses (type: BadgeType) {
  const baseClasses = 'text-white';
  const typeClasses: Record<BadgeType, string> = {
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    primary: 'bg-blue-600 hover:bg-blue-700',
    error: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-500 hover:bg-green-600',
    info: 'bg-gray-600 hover:bg-gray-700',
  };

  const selectedType = type || defaultType;
  return `${baseClasses} ${typeClasses[selectedType]}`;
};
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm transition-all duration-200"
    :class="badgeClasses(type || defaultType)"
  >
    {{ text }}
  </span>
</template>

<style scoped>
span {
  cursor: default;
}
</style>
