<!-- src/components/EventModal.vue -->
<script setup lang="ts">
import { CalendarDaysIcon, MapPinIcon, XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline';
import type { EventInterface } from '@/interface/EventInterface.ts';
import Badge from '@/components/Badge.vue';

defineProps<{
  event: EventInterface | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'join', id: number): void;
  (e: 'waitlist', id: number): void;
}>();

function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calculateDuration(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}min`;
}
</script>

<template>
  <div style="background-color: rgba(0,0,0,0.8)" v-if="event" class="fixed inset-0 flex items-center justify-center z-50 p-5">
    <!-- Modal -->
    <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full relative">
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
        <XMarkIcon class="w-6 h-6" />
      </button>

      <!-- Content -->
      <div class="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
        <h2 class="text-2xl font-bold text-gray-800">{{ event.name }}</h2>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <badge text="Happening" type="info" v-if="event.is_happening"/>
          <badge text="Participant" type="success" v-if="event.is_participant"/>
          <badge text="Waiting" type="info" v-if="event.is_waiting"/>
          <badge text="Past" type="warning" v-if="event.is_past"/>
          <badge text="Full" type="warning" v-if="!event.can_add_new_participant"/>
          <badge text="Full wait list" type="warning" v-if="!event.can_add_in_waitList"/>
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ event.description }}</p>

        <!-- Info -->
        <div class="space-y-2">
          <div class="flex items-center text-gray-700 space-x-2">
            <CalendarDaysIcon class="w-5 h-5" />
            <span>{{ formatDate(event.starts_at, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
            <span>•</span>
            <span>{{ formatTime(event.starts_at) }}</span>
            <span>•</span>
            <span>{{ calculateDuration(event.starts_at, event.ends_at) }}</span>
          </div>
          <div class="flex items-center text-gray-700 space-x-2">
            <MapPinIcon class="w-5 h-5" />
            <span>{{ event.location }}</span>
          </div>
        </div>
        <ul class="space-y-2 text-gray-600">
          <li class="text-gray-600 flex items-center" v-if="event.is_happening"> <check-icon class="w-5 h-5"/> <span>The event is currently being held</span> </li>
          <li class="text-green-500 flex items-center" v-if="event.is_participant"><check-icon class="w-5 h-5"/> You will be attending</li>
          <li class="text-gray-600 flex items-center" v-if="event.is_waiting"><check-icon class="w-5 h-5"/> <span>You are currently in the waitlist for this event</span></li>
          <li class="text-yellow-500 flex items-center" v-if="event.is_past"><check-icon class="w-5 h-5"/> <span>This event wrapped up a while ago</span></li>
          <li class="text-yellow-500 flex items-center" v-if="!event.can_add_new_participant"><check-icon class="w-5 h-5"/> <span>This event is at full capacity</span></li>
          <li class="text-yellow-500 flex items-center" v-if="!event.can_add_in_waitList"><check-icon class="w-5 h-5"/> <span>This event's wait list is at full capacity</span></li>
        </ul>

        <!-- Actions -->
        <div v-if="new Date(event.ends_at) > new Date()" class="pt-4 flex space-x-3">
          <button v-if="!event.is_past && !event.is_participant && !event.is_waiting && event.can_add_new_participant"
                  @click="$emit('join', event.id)"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Join
          </button>
          <button v-if="!event.is_past && !event.is_participant && !event.is_waiting && !event.can_add_new_participant && event.can_add_in_waitList"
                  @click="$emit('waitlist', event.id)"
                  class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
            Join Wait list
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
