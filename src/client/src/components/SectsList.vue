<script setup>
defineProps({
  sects: Array,
  meta: Object,
  loading: Boolean,
  error: String,
});
</script>

<template>
  <section class="border p-4 rounded shadow bg-white">
    <h2 class="text-xl font-bold mb-2">🛕 Sects</h2>

    <div v-if="loading">⏳ Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <p class="mb-2 text-sm">
        Server mode:
        <span class="font-medium">
          {{
            meta.db_on_flag === "1" ? "using database" : "not using database"
          }}
        </span>
        <br />
        Database connection:
        <span class="font-medium">
          {{
            meta.db_on_flag === "1"
              ? meta.status === "ok"
                ? "✅ successful"
                : "❌ failed"
              : "❎ disabled"
          }}
        </span>
      </p>

      <ul>
        <li
          v-for="sect in sects"
          :key="sect.id"
          class="flex items-center justify-between px-4 py-2 border rounded mb-2 bg-white shadow-sm"
        >
          <span class="font-medium">{{ sect.name }}</span>
          <span
            class="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full"
          >
            Power: {{ sect.power }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
