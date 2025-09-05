<template>
  <div class="tinymce-wrapper">
    <Editor
      :api-key="apiKey"
      :model-value="modelValue"
      :init="editorConfig"
      :disabled="disabled"
      @update:model-value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { ref, watch } from 'vue';
import type { TinyMCEProps, TinyMCEEmits } from '@/model/tinymce-interface';

const props = withDefaults(defineProps<TinyMCEProps>(), {
  modelValue: '',
  disabled: false,
  placeholder: 'Masukkan deskripsi...',
  height: 300,
});

const emit = defineEmits<TinyMCEEmits>();

const apiKey = computed(() => import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key');

const editorConfig = ref({
  height: props.height,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help',
  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
  placeholder: props.placeholder,
  branding: false,
  promotion: false,
  statusbar: false,
  resize: false,
  setup: (editor: unknown) => {
    const editorInstance = editor as { on: (event: string, callback: () => void) => void; getContainer: () => { style: { border: string; borderRadius: string } } };
    editorInstance.on('init', () => {
      editorInstance.getContainer().style.border = '1px solid #ccc';
      editorInstance.getContainer().style.borderRadius = '4px';
    });
  }
});

const handleUpdate = (value: string) => {
  emit('update:modelValue', value);
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    // Handle external updates if needed
  }
});
</script>

<style scoped>
.tinymce-wrapper {
  width: 100%;
}

:deep(.tox-tinymce) {
  border-radius: 4px !important;
}

:deep(.tox-editor-header) {
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.tox-edit-area__iframe) {
  border-radius: 0 0 4px 4px !important;
}
</style>
