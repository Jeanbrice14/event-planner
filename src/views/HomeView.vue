<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import type { EventInterface } from '@/interface/EventInterface.ts';
import EventTimeline from '@/components/EventTimeline.vue';
import { showError, showSuccess } from '@/helper/notyf.ts'

const events = ref<EventInterface[]>([]);
const loading = ref(true);
const search = ref('');

const dateFrom = ref('');
const dateTo = ref('');
const filtersOpen = ref(false);

const filteredEvents = computed(() => {
  return events.value; //.value.filter(event => new Date(event.ends_at) >= new Date());
});

async function fetchEvents() {
  loading.value = true;
  try {
    const response = await axios.get('/api/events', {
      params: {
        search: search.value,
        date_from: dateFrom.value,
        date_to: dateTo.value
      }
    });
    console.log(response);
    events.value = response.data.data;
  } catch (error) {
    console.error('Failed to load events', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchEvents);

function handleSearch() {
  fetchEvents();
}

async function handleJoin(eventId: number) {
  try {
    await axios.post('/api/events/'+eventId+'/join', { event_id: eventId });
    fetchEvents();
    showSuccess('Successfully joined event!');
  } catch (error: any) {
    showError(error?.response?.data?.message || error);
  }
}

async function handleWaitlist(eventId: number) {
  try {
    await axios.post('/api/events/wait', { event_id: eventId });
    fetchEvents();
    showSuccess('Successfully added to wait list!')
  } catch (error: any) {
    showError(error?.response?.data?.message || error);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col w-full">
    <!-- Search & Filter Bar -->
    <div class="bg-white shadow-md p-4 mx-auto mt-6 container">
      <div class="container mx-auto space-y-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <input
            v-model="search"
            type="text"
            placeholder="Search events..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            @click="filtersOpen = !filtersOpen"
            class="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200"
          >
            Filters
          </button>
          <button
            @click="handleSearch"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>

        <div v-if="filtersOpen" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="dateFrom"
            type="datetime-local"
            class="px-4 py-2 border rounded-lg"
            placeholder="From"
          />
          <input
            v-model="dateTo"
            type="datetime-local"
            class="px-4 py-2 border rounded-lg"
            placeholder="To"
          />
        </div>
      </div>
    </div>

    <!-- Event Timeline List -->
    <div class="container mx-auto py-8 flex-1">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <svg class="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>

      <div v-else>
        <div v-if="filteredEvents.length === 0" class="text-center text-gray-500">No events found.</div>
        <EventTimeline v-else :events="filteredEvents" @join="handleJoin" @waitlist="handleWaitlist" />
      </div>
    </div>
  </div>
</template>
