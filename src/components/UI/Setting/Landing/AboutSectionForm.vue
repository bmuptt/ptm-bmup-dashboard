<template>
  <v-card
    class="pa-4"
    :loading="loading"
  >
    <v-form :disabled="loading">
      <v-row>
        <v-col cols="12">
          <label class="text-body-2 text-medium-emphasis mb-2 d-block">
            Visi
          </label>
          <TipTap
            v-model="visiContent"
            :disabled="loading"
            placeholder="Isi konten visi..."
            :height="200"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <label class="text-body-2 text-medium-emphasis mb-2 d-block">
            Misi
          </label>
          <TipTap
            v-model="misiContent"
            :disabled="loading"
            placeholder="Isi konten misi..."
            :height="200"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import TipTap from '@/components/common/TipTap.vue';
import type { ILandingItem } from '@/model/landing-interface';

const props = withDefaults(defineProps<{
  items: ILandingItem[];
  loading?: boolean;
}>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:items', value: ILandingItem[]): void;
}>();


const visiContent = ref<string>('');
const misiContent = ref<string>('');

const findItem = (key: string) => props.items.find((item) => item.key === key);

const initializeFromItems = () => {
  const visi = findItem('visi');
  const misi = findItem('misi');

  visiContent.value = visi?.content || '';
  misiContent.value = misi?.content || '';
};

watch(
  () => props.items,
  () => {
    initializeFromItems();
  },
  { immediate: true, deep: true }
);

const buildItemsPayload = () => {
  const basePublished = true;

  const visi: ILandingItem = {
    id: findItem('visi')?.id || 0,
    key: 'visi',
    type: 'text',
    title: null,
    content: visiContent.value || null,
    image_url: null,
    button_label: null,
    button_url: null,
    published: basePublished,
  };

  const misi: ILandingItem = {
    id: findItem('misi')?.id || 0,
    key: 'misi',
    type: 'text',
    title: null,
    content: misiContent.value || null,
    image_url: null,
    button_label: null,
    button_url: null,
    published: basePublished,
  };

  emit('update:items', [visi, misi]);
};

watch(
  [visiContent, misiContent],
  () => {
    buildItemsPayload();
  }
);
</script>

