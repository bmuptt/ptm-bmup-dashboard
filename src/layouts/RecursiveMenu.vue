<template>
  <div
    v-for="(item) in items"
    :key="item.key_menu"
  >
    <v-list-group
      v-if="item.children.length !== 0"
      :value="item.key_menu"
    >
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          :title="item.name"
          color="primary"
          rounded="xl"
        />
      </template>

      <recursive-menu :items="item.children" />
    </v-list-group>

    <v-list-item
      v-else
      link
      :to="item.url !== null ? item.url : '/home'"
      color="primary"
      rounded="xl"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script lang="ts" setup>
import type { IResponseMenu } from '@/model/menu-interface'
import { type PropType } from 'vue'

defineProps({
    items: {
        type: Array as PropType<IResponseMenu[]>,
        default: () => []
    }
})
</script>