<template>
  <v-card
    class="pa-4"
    :loading="loading"
  >
    <v-form :disabled="loading">
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="heroTitle"
            label="Hero Title"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="heroSubtitle"
            label="Hero Subtitle"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="heroButtonLabel"
            label="Hero Button Label"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="heroButtonUrl"
            label="Hero Button URL"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-textarea
            v-model="aboutContent"
            label="Tentang Kami (Home)"
            variant="outlined"
            rows="4"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <div class="d-flex flex-column align-center">
            <v-img
              :src="currentImage || '/static/img/no_image.png'"
              width="160"
              height="120"
              cover
              class="rounded border mb-2"
            />
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              style="display: none;"
              @change="handleFileChange"
            >
            <div class="text-caption text-grey mb-2">
              Rekomendasi ukuran: 872 x 400 px
            </div>
            <v-btn
              color="primary"
              size="small"
              class="mb-2 text-none"
              @click="openFileInput"
            >
              Pilih Gambar
            </v-btn>
            <v-btn
              v-if="currentImage"
              color="error"
              variant="outlined"
              size="small"
              class="text-none"
              @click="deleteImage"
            >
              Hapus Gambar
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contactEmailContent"
            label="Email (Hubungi Kami)"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contactEmailButtonUrl"
            label="Email Button URL"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contactPhoneContent"
            label="Nomor Telepon / Whatsapp"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contactPhoneButtonUrl"
            label="Telepon Button URL"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import type { ILandingItem } from '@/model/landing-interface';

const props = withDefaults(defineProps<{
  items: ILandingItem[];
  loading?: boolean;
}>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:items', value: ILandingItem[]): void;
  (e: 'update:image', file: File | null, statusImage: '0' | '1'): void;
}>();


const fileInputRef = ref<HTMLInputElement | null>(null);
const currentImage = ref<string>('');
const imageStatus = ref<'0' | '1'>('0');
const imageFile = ref<File | null>(null);

const heroTitle = ref<string>('');
const heroSubtitle = ref<string>('');
const heroButtonLabel = ref<string>('');
const heroButtonUrl = ref<string>('');
const aboutContent = ref<string>('');
const contactEmailContent = ref<string>('');
const contactEmailButtonUrl = ref<string>('');
const contactPhoneContent = ref<string>('');
const contactPhoneButtonUrl = ref<string>('');

const findItem = (key: string) => props.items.find((item) => item.key === key);

const initializeFromItems = () => {
  const hero = findItem('hero');
  const tentangKami = findItem('tentang_kami');
  const contactEmail = findItem('contact_email');
  const contactPhone = findItem('contact_phone');

  heroTitle.value = hero?.title || '';
  heroSubtitle.value = hero?.content || '';
  heroButtonLabel.value = hero?.button_label || '';
  heroButtonUrl.value = hero?.button_url || '';

  aboutContent.value = tentangKami?.content || '';

  const newImageUrl = tentangKami?.image_url || '';
  if (currentImage.value !== newImageUrl) {
    currentImage.value = newImageUrl;
    imageStatus.value = '0';
    imageFile.value = null;
  }

  contactEmailContent.value = contactEmail?.content || '';
  contactEmailButtonUrl.value = contactEmail?.button_url || '';

  contactPhoneContent.value = contactPhone?.content || '';
  contactPhoneButtonUrl.value = contactPhone?.button_url || '';
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

  const hero: ILandingItem = {
    id: findItem('hero')?.id || 0,
    key: 'hero',
    type: 'text',
    title: heroTitle.value || null,
    content: heroSubtitle.value || null,
    image_url: null,
    button_label: heroButtonLabel.value || null,
    button_url: heroButtonUrl.value || null,
    published: basePublished,
  };

  const tentangKami: ILandingItem = {
    id: findItem('tentang_kami')?.id || 0,
    key: 'tentang_kami',
    type: 'text',
    title: null,
    content: aboutContent.value || null,
    image_url: currentImage.value || null,
    button_label: null,
    button_url: null,
    published: basePublished,
  };

  const contactEmail: ILandingItem = {
    id: findItem('contact_email')?.id || 0,
    key: 'contact_email',
    type: 'text',
    title: null,
    content: contactEmailContent.value || null,
    image_url: null,
    button_label: null,
    button_url: contactEmailButtonUrl.value || null,
    published: basePublished,
  };

  const contactPhone: ILandingItem = {
    id: findItem('contact_phone')?.id || 0,
    key: 'contact_phone',
    type: 'text',
    title: null,
    content: contactPhoneContent.value || null,
    image_url: null,
    button_label: null,
    button_url: contactPhoneButtonUrl.value || null,
    published: basePublished,
  };

  emit('update:items', [hero, tentangKami, contactEmail, contactPhone]);
  emit('update:image', imageFile.value, imageStatus.value);
};

watch(
  [
    heroTitle,
    heroSubtitle,
    heroButtonLabel,
    heroButtonUrl,
    aboutContent,
    contactEmailContent,
    contactEmailButtonUrl,
    contactPhoneContent,
    contactPhoneButtonUrl,
    currentImage,
    imageStatus,
  ],
  () => {
    buildItemsPayload();
  }
);

const openFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files && target.files[0] ? target.files[0] : null;
  if (file) {
    imageFile.value = file;
    imageStatus.value = '1';
    currentImage.value = URL.createObjectURL(file);
  }
  // Reset input value to allow re-uploading the same file
  if (target) {
    target.value = '';
  }
};

const deleteImage = () => {
  if (currentImage.value && currentImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentImage.value);
  }
  currentImage.value = '';
  imageFile.value = null;
  imageStatus.value = '1';
};
</script>

