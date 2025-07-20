<script setup lang="ts">
import { CalendarDaysIcon, MapPinIcon, EyeIcon } from '@heroicons/vue/24/outline';
import type { EventInterface } from '@/interface/EventInterface.ts';
import Badge from '@/components/Badge.vue';
import EventModal from '@/components/EventModal.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.ts';


const authStore = useAuthStore();

defineProps<{

  events: EventInterface[],

}>();

const emit = defineEmits<{
  (e: 'join', id: number): void;
  (e: 'waitlist', id: number): void;
}>();


const selectedEvent = ref<EventInterface | null>(null);

function openEvent(event: EventInterface) {
  selectedEvent.value = event;
}

function closeModal() {
  selectedEvent.value = null;
}

function joinEvent(id: number) {
  emit('join', id);
  closeModal();
}

function isParticipant(event: EventInterface) {
  if (!authStore.user) return false;
  const user = authStore.user as any;
  return event.participants.some((participant: any) => participant.id === user.id);
}



function waitlistEvent(id: number) {
  emit('waitlist', id);
  closeModal();
}

function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function calculateDuration(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60 // in minutes
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}min`
}

function groupByMonth(eventsList: any[]) {
  console.log(eventsList);
  return eventsList.reduce((acc, event) => {
    const month = formatDate(event.starts_at, { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(event)
    return acc
  }, {} as Record<string, any[]>)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="relative">
      <div v-for="(eventsInMonth, month) in groupByMonth(events)" :key="month" class="mb-10">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">{{ month }}</h2>

        <div v-for="event in eventsInMonth" :key="event.id" class="relative flex  justify-items-center items-center lg:items-start lg:justify-items-start mb-10 flex-col lg:flex-row">
          <div class="flex flex-col items-center mr-6 mb-4">
            <div style="width: 100px;" class="bg-indigo-500 text-center text-white border-2 border-indigo-500 text-sm font-bold px-4 py-2 rounded-t-md ">
              {{ formatDate(event.starts_at, { month: 'short' }).toUpperCase() }}
            </div>
            <div style="width: 100px;" class="bg-white border-2 text-center border-indigo-500 text-indigo-600 font-bold text-xl px-4 py-2 rounded-b-md">
              {{ formatDate(event.starts_at, { day: '2-digit' }) }}
            </div>
            <div class="h-full w-1 bg-indigo-300"></div>
          </div>

          <!-- Event card -->

          <div class="bg-white shadow-sm rounded-lg flex overflow-hidden w-full" :class="{'opacity-80': event.is_past}">
            <!-- Illustration -->
            <div class="w-56 bg-cover bg-center p-4 flex justify-center align-middle items-center" :style="`background-image: url('/img/event-placeholder.jpg')`">
              <img src="../assets/undraw_schedule_6t8k.svg" alt="">
            </div>

            <!-- Content -->
            <div class="px-4 py-4 flex-1 space-y-2">
              <h3 class="text-xl font-bold text-gray-800 flex items-center  "><span>{{ event.name }}</span>  <span class="cursor-pointer ml-4" title="See details" @click="openEvent(event)"><EyeIcon class="w-5 h-5"/></span></h3>
              <div class="flex items-center space-x-2">
                <badge text="Happening" type="info" v-if="event.is_happening"/>
                <badge text="Participant" type="success" v-if="isParticipant(event)"/>
                <badge text="Waiting" type="info" v-if="event.is_waiting"/>
                <badge text="Past" type="warning" v-if="event.is_past"/>
                <badge text="Full" type="warning" v-if="!event.can_add_new_participant"/>
                <badge text="Full wait list" type="warning" v-if="!event.can_add_in_waitList"/>
              </div>
              <p class="text-gray-600">{{ event.description?.length > 255 ? event.description.substring(0, 100) + '...' : event.description }}</p>
              <div class="flex items-center text-gray-700 space-x-2">
                <CalendarDaysIcon class="w-5 h-5" />
                <span>{{ formatDate(event.starts_at, { weekday: 'short', day: 'numeric', month: 'short' }) }}</span>
                <span>•</span>
                <span>{{ formatTime(event.starts_at) }}</span>
                <span>•</span>
                <span>{{ calculateDuration(event.starts_at, event.ends_at) }}</span>
              </div>
              <div class="flex items-center text-gray-700 space-x-2">
                <MapPinIcon class="w-5 h-5" />
                <span>{{ event.location }}</span>
              </div>

              <!-- Actions -->
              <div v-if="new Date(event.ends_at) > new Date()" class="pt-2 flex space-x-3">
                <button v-if="!event.is_past && !isParticipant(event) && !event.is_waiting && event.can_add_new_participant" @click="$emit('join', event.id)"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer">
                  Join
                </button>
                <button v-if="!event.is_past && !isParticipant(event) && !event.is_waiting && !event.can_add_new_participant && event.can_add_in_waitList" @click="$emit('waitlist', event.id)"
                  class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition cursor-pointer"
                >
                  Join Wait list
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EventModal :event="selectedEvent" @close="closeModal" @join="joinEvent" @waitlist="waitlistEvent" />
  </div>
</template>
