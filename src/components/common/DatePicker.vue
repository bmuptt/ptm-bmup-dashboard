<template>
  <div>
    <v-menu
      v-model="isMenuOpen"
      :close-on-content-click="false"
    >
      <template #activator="{ props }">
        <v-text-field
          density="compact"
          :variant="variant"
          :label="label"
          :model-value="dataDate"
          v-bind="props"
          readonly
          :clearable="propsData.clearable"
          :hide-details="propsData.hideDetails"
          :error-messages="errorMessages"
          @click:clear="formatDate = null"
          @blur="$emit('blur')"
        >
          <template
            v-if="$slots.append"
            #append
          >
            <slot name="append" />
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        v-model="formatDate"
        color="primary"
        input-placeholder="MM/dd/yyyy"
        @update:model-value="isMenuOpen = false"
      />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { propsComponentCommon } from '@/utils/props';
import { format } from 'date-fns';

// props
const propsData = defineProps(propsComponentCommon)
const emit = defineEmits(['update:modelValue', 'blur']);

// data
const isMenuOpen = ref(false);
const formatDate = ref(
  propsData.modelValue !== null ? new Date(propsData.modelValue) : null
);

const dataDate = computed(() => {
  if (formatDate.value === null) {
    return null;
  } else {
    return format(formatDate.value, 'yyyy-MM-dd');
  }
});

// watch
watch(dataDate, (newDate) => {
  emit('update:modelValue', newDate);
});
watch(
  () => propsData.modelValue,
  (newValue) => {
    formatDate.value = newValue !== null ? new Date(newValue) : null;
  }
);
</script>
