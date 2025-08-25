<template>
  <v-card>
    <div class="pa-6 bg-white rounded-lg">
      <v-row class="d-flex align-center">
        <v-col cols="6">
          <div class="font-24 font-weight-bold">
            Structure Menu
          </div>
        </v-col>
        <v-col
          cols="6"
          class="text-right"
        >
          <v-btn
            variant="text"
            color="primary"
            class="mr-2 mb-2"
            icon="mdi-close"
            @click="$emit('closeDialog')"
          />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col
          cols="12"
        >
          <v-treeview
            :items="structureMenu"
            item-value="id"
            item-title="name"
            open-all
          />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { emitsGlobal } from '@/utils/props';

defineEmits(emitsGlobal);
defineProps({
  structureMenu: {
    type: Array,
    default: () => [],
  },
});
</script>
