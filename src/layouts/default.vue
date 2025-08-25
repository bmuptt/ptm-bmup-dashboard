<template>
  <v-app>
    <core-system
      v-if="
        route.matched.length &&
          route.matched[1].meta.coreSystem === 'CoreSystem'
      "
    />

    <no-core
      v-if="
        route.matched.length &&
          route.matched[1].meta.coreSystem === 'NoCore'
      "
    />
  </v-app>
</template>

<script lang="ts" setup>
  import CoreSystem from './CoreSystem.vue';
  import NoCore from './NoCore.vue';
  
  const route = useRoute()
</script>
