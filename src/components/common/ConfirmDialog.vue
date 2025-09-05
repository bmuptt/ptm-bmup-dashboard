<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        <v-icon
          v-if="icon"
          :color="iconColor"
          class="mr-2"
        >
          {{ iconName }}
        </v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text>
        <div>{{ html }}</div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="handleCancel"
        >
          {{ cancelButtonText }}
        </v-btn>
        <v-btn
          :color="confirmButtonColor"
          variant="flat"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { ConfirmDialogProps, ConfirmDialogEmits } from '@/model/confirm-dialog-interface';

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  confirmButtonText: 'Save',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#f86f24',
  icon: undefined,
});

const emit = defineEmits<ConfirmDialogEmits>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const iconName = computed(() => {
  const iconMap = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
    question: 'mdi-help-circle',
  };
  return iconMap[props.icon!] || 'mdi-information';
});

const iconColor = computed(() => {
  const colorMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    question: 'primary',
  };
  return colorMap[props.icon!] || 'primary';
});

const handleConfirm = () => {
  emit('confirm');
  dialog.value = false;
};

const handleCancel = () => {
  emit('cancel');
  dialog.value = false;
};
</script>
