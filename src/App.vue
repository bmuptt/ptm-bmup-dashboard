<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { getCoreSetting } from '@/service/Setting/core';
import { useAppStore } from '@/stores/app';
import { useTheme } from 'vuetify';

const store = useAppStore();
const theme = useTheme();

const fetchCoreSetting = () => {
  getCoreSetting()
    .then(({ data }) => {
      store.addCoreSetting(data.data);
      
      // Update Vuetify theme primary color dynamically
      if (data.data.primary_color) {
        theme.themes.value.customTheme.colors.primary = data.data.primary_color;
      }
    })
    .catch((error) => {
      console.error('Error fetching core setting:', error);
    });
};

// Watch for core setting changes
watch(
  () => store.coreSetting,
  (newV) => {
    if (newV) {
      // Update Vuetify theme primary color dynamically
      if (newV.primary_color) {
        theme.themes.value.customTheme.colors.primary = newV.primary_color;
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  fetchCoreSetting();
});
</script>
