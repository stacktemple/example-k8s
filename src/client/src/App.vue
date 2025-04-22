<script setup>
import HealthCard from "./components/HealthCard.vue";
import SectsList from "./components/SectsList.vue";
import { ref, onMounted } from "vue";

const baseUrl = import.meta.env.VITE_BASE_URL;

const health = ref(null);
const healthLoading = ref(true);
const healthError = ref(null);

const sects = ref([]);
const sectsMeta = ref({ status: "", db_on_flag: "0" });
const sectsLoading = ref(true);
const sectsError = ref(null);

const fetchHealth = async () => {
  healthLoading.value = true;
  healthError.value = null;
  try {
    const res = await fetch(`${baseUrl}/health`);
    health.value = await res.json();
  } catch (err) {
    healthError.value = "Failed to fetch health";
  } finally {
    healthLoading.value = false;
  }
};

const fetchSects = async () => {
  sectsLoading.value = true;
  sectsError.value = null;
  try {
    const res = await fetch(`${baseUrl}/sects`);
    const result = await res.json();
    sects.value = result.data;
    sectsMeta.value = {
      status: result.status,
      db_on_flag: result.db_on_flag,
    };
  } catch (err) {
    sectsError.value = "Failed to fetch sects";
  } finally {
    sectsLoading.value = false;
  }
};

onMounted(() => {
  fetchHealth();
  fetchSects();
});
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 space-y-6">
    <HealthCard
      :health="health"
      :loading="healthLoading"
      :error="healthError"
      @refresh="fetchHealth"
    />
    <SectsList
      :sects="sects"
      :meta="sectsMeta"
      :loading="sectsLoading"
      :error="sectsError"
    />
  </div>
</template>
