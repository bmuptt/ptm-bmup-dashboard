<template>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { getCoreSetting } from '@/service/Setting/core';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

const fetchCoreSetting = () => {
  getCoreSetting()
    .then(({ data }) => {
      store.addCoreSetting(data.data);
      
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  fetchCoreSetting();
});
</script>