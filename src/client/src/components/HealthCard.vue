<script setup>
defineProps({
  health: Object,
  loading: Boolean,
  error: String,
});

const emit = defineEmits(["refresh"]);
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800 flex items-center space-x-2">
      <span>📦 example-k8s</span>
      <a
        href="https://github.com/stacktemple/example-k8s"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 text-sm hover:underline"
      >
        GitHub ↗
      </a>
    </h1>
    <p class="text-gray-500 text-sm">
      A minimal Kubernetes showcase for health check, service status, and DB
      condition.
    </p>
  </div>
  <section class="border p-4 rounded shadow bg-white space-y-2">
    <h2 class="text-xl font-bold mb-2">🔥 Health Status</h2>

    <div v-if="loading">⏳ Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div class="flex justify-between">
        <span class="text-gray-600">Status:</span>
        <span
          :class="[
            'text-sm font-semibold px-2 py-0.5 rounded-full',
            health.status === 'ok'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          ]"
        >
          {{ health.status }}
        </span>
      </div>
      <div class="flex justify-between">
        <span>Uptime:</span><span>{{ health.uptime }}</span>
      </div>
      <div class="flex justify-between">
        <span>Hostname:</span><span>{{ health.hostname }}</span>
      </div>
      <div class="flex justify-between">
        <span>Timestamp:</span><span>{{ health.timestamp }}</span>
      </div>

      <div class="pt-2 text-right">
        <button
          @click="emit('refresh')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  </section>
</template>
