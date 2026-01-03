<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-form
        :disabled="resultLoading"
        @submit.prevent="submitForm"
      >
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <div class="font-24 font-weight-bold">
              {{ props.selectData ? 'Edit Galeri' : 'Add Galeri' }}
            </div>
          </v-col>
          <v-col
            cols="6"
            class="text-right"
          >
            <v-btn
              variant="outlined"
              color="primary"
              class="mr-2 mb-2"
              :loading="resultLoading"
              @click="emit('closeDialog')"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              class="mr-2 mb-2"
              :loading="resultLoading"
              :disabled="v$.$invalid || resultLoading"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="state.title"
              density="compact"
              label="Title"
              variant="outlined"
              clearable
              :error-messages="v$.title.$errors.map((e) => e.$message as string)"
              @blur="v$.title.$touch()"
            />
          </v-col>

          <v-col cols="12">
            <div
              class="d-flex"
              :class="xs ? 'flex-column' : 'align-center'"
              data-testid="gallery-upload-row"
            >
              <div
                class="image-container position-relative"
                :class="xs ? 'mb-2' : 'mr-4'"
                style="width: 140px;"
              >
                <v-img
                  :src="currentImage || '/static/img/no_image.png'"
                  width="140"
                  height="90"
                  cover
                  class="rounded border"
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  class="image-edit-btn"
                  :disabled="resultLoading"
                  data-testid="gallery-image-open-file"
                  @click="openFileInput"
                />
              </div>
              <div class="flex-grow-1">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display: none;"
                  data-testid="gallery-image-input"
                  @change="handleFileChange"
                >
                <div
                  class="text-caption text-grey"
                  data-testid="gallery-image-recommendation"
                >
                  Rekomendasi minimal 574x383 px
                </div>
                <div
                  v-if="props.selectData"
                  class="text-caption text-medium-emphasis mt-1"
                >
                  Jika ingin mengganti gambar, upload ulang.
                </div>
                <div
                  v-if="v$.image.$errors.length > 0"
                  class="text-caption text-error mt-1"
                >
                  {{ v$.image.$errors.map((e) => e.$message as string).join(', ') }}
                </div>
                <v-btn
                  v-if="currentImage"
                  color="error"
                  variant="outlined"
                  size="small"
                  class="mt-2 text-none"
                  :block="xs"
                  :disabled="resultLoading"
                  data-testid="gallery-image-delete"
                  @click="deleteImage"
                >
                  Hapus Gambar
                </v-btn>
              </div>
            </div>
          </v-col>

          <v-col
            v-if="state.image_url"
            cols="12"
          >
            <v-card
              variant="outlined"
              class="pa-3"
            >
              <div class="font-weight-medium mb-2">
                Preview
              </div>
              <v-img
                :src="state.image_url"
                height="220"
                cover
                class="rounded"
              />
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-switch
              v-model="state.is_published"
              density="compact"
              color="primary"
              label="Published"
              hide-details
            />
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { useLoadingForm } from '@/utils/loading';
import { createGalleryItem, getGalleryItemDetail, updateGalleryItem } from '@/service/Setting/galleryItems';
import type { IGalleryItem, IRequestGalleryItemForm } from '@/model/gallery-item-interface';
import { createRules } from '@/utils/setting/gallery-items/form';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const props = defineProps<{
  selectData: IGalleryItem | null;
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
  (e: 'refreshPage'): void;
}>();

const { xs } = useDisplay();
const { loading, resultLoading } = useLoadingForm();

const state = reactive<IRequestGalleryItemForm>({
  image: null,
  title: '',
  is_published: true,
  image_url: null,
  status_file: '0',
});

const rules = computed(() => createRules(!props.selectData || state.status_file === '1'));
const v$ = useVuelidate(rules, state);

const currentImage = ref<string>('');
const fileInputRef = ref<HTMLInputElement | null>(null);
const serverImageUrl = ref<string>('');

const openFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files && target.files[0] ? target.files[0] : null;

  if (!file) {
    target.value = '';
    return;
  }

  if (currentImage.value && currentImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentImage.value);
  }

  state.image = file;
  state.status_file = '1';
  currentImage.value = URL.createObjectURL(file);
  state.image_url = currentImage.value;
  v$.value.image.$touch();
  target.value = '';
};

const deleteImage = () => {
  state.image = null;
  state.status_file = props.selectData ? '1' : '0';
  if (currentImage.value && currentImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentImage.value);
  }
  if (props.selectData) {
    currentImage.value = '';
    state.image_url = null;
  } else {
    currentImage.value = '';
    state.image_url = null;
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const resetForm = () => {
  state.image = null;
  state.title = '';
  state.is_published = true;
  state.image_url = null;
  state.status_file = '0';
  serverImageUrl.value = '';
  if (currentImage.value && currentImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentImage.value);
  }
  currentImage.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  v$.value.$reset();
};

const fetchForm = () => {
  v$.value.$reset();

  if (!props.selectData) {
    resetForm();
    return;
  }

  loading.data = true;
  getGalleryItemDetail(props.selectData.id)
    .then(({ data }) => {
      state.image = null;
      state.title = data.data.title;
      state.is_published = data.data.is_published;
      state.image_url = data.data.image_url;
      state.status_file = '0';
      serverImageUrl.value = data.data.image_url || '';
      currentImage.value = data.data.image_url || '';
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.data = false;
    });
};

const buildPayload = (): FormData => {
  const formData = new FormData();
  formData.append('title', state.title);
  formData.append('is_published', String(state.is_published));
  if (props.selectData) {
    formData.append('status_file', state.status_file);
  }
  if (state.image) {
    if (!props.selectData || state.status_file === '1') {
      formData.append('image', state.image);
    }
  }
  return formData;
};

const submitForm = () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  const payload = buildPayload();
  loading.submit = true;

  const request = props.selectData
    ? updateGalleryItem(props.selectData.id, payload)
    : createGalleryItem(payload);

  request
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Galeri berhasil disimpan', 'success');
      emit('refreshPage');
      emit('closeDialog');
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.submit = false;
    });
};

watch(
  () => props.selectData,
  () => {
    fetchForm();
  }
);

onMounted(() => {
  fetchForm();
});
</script>

<style scoped>
.image-container {
  position: relative;
}

.image-edit-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
}
</style>
