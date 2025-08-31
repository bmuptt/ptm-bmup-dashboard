<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="8"
      >
        <v-card
          class="pa-6"
          :loading="loading.data"
        >
          <v-form
            :disabled="loading.data"
            @submit.prevent="handleSubmit"
          >
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="state.name"
                  label="Nama Aplikasi"
                  variant="outlined"
                  density="compact"
                  :error-messages="v$.name.$errors.map((e) => e.$message as string)"
                  @blur="v$.name.$touch()"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="state.description"
                  label="Deskripsi"
                  variant="outlined"
                  density="compact"
                  clearable
                  :error-messages="v$.description.$errors.map((e) => e.$message as string)"
                  @blur="v$.description.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="state.address"
                  label="Alamat"
                  variant="outlined"
                  density="compact"
                  :error-messages="v$.address.$errors.map((e) => e.$message as string)"
                  rows="3"
                  @blur="v$.address.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="state.maps"
                  label="Link Maps (Opsional)"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="https://maps.google.com/..."
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <div class="d-flex align-center">
                  <div class="logo-container position-relative mr-4">
                    <v-img
                      :src="currentLogo || '/static/img/no_image.png'"
                      width="80"
                      height="80"
                      cover
                      class="rounded border"
                    />
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="primary"
                      class="logo-edit-btn"
                      @click="openFileInput"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      style="display: none;"
                      @change="handleFileChange"
                    >
                    <div class="text-caption text-grey">
                      Format: JPEG, PNG, JPG, GIF | Maksimal: 2MB
                    </div>
                    <v-btn
                      v-if="currentLogo"
                      color="error"
                      variant="outlined"
                      size="small"
                      class="mt-2"
                      @click="deleteLogo"
                    >
                      Hapus Logo
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="state.primary_color"
                  label="Kode Warna Utama"
                  variant="outlined"
                  density="compact"
                  :error-messages="v$.primary_color.$errors.map((e) => e.$message as string)"
                  type="color"
                  @blur="v$.primary_color.$touch()"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="state.secondary_color"
                  label="Kode Warna Sekunder"
                  variant="outlined"
                  density="compact"
                  :error-messages="v$.secondary_color.$errors.map((e) => e.$message as string)"
                  type="color"
                  @blur="v$.secondary_color.$touch()"
                />
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading.submit"
                  :disabled="v$.$invalid"
                >
                  Update Core Setting
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>

import { updateCoreSetting } from '@/service/Setting/core';
import { useLoadingComponent } from '@/utils/loading';
import { rules } from '@/utils/setting/core/form';
import useVuelidate from '@vuelidate/core';
import { useAppStore } from '@/stores/app';


const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;
const appStore = useAppStore();

// loading
const { loading } = useLoadingComponent();

// data
const state = reactive({
  name: '',
  logo: null as File | null,
  description: '',
  address: '',
  maps: null as string | null,
  primary_color: '#3B82F6',
  secondary_color: '#1E40AF',
  status_logo: '0',
});

// vuelidate
const v$ = useVuelidate(rules, state);

const currentLogo = ref<string>('');
const fileInputRef = ref();



const openFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    state.logo = target.files[0];
    state.status_logo = '1';
    // Create preview URL
    currentLogo.value = URL.createObjectURL(target.files[0]);
  }
};

const deleteLogo = () => {
  state.logo = null;
  state.status_logo = '1';
  // Clean up object URL if exists
  if (currentLogo.value && currentLogo.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentLogo.value);
  }
  currentLogo.value = '';
};

const fetchData = () => {
  loading.data = true;
  
  // Use data from store instead of fetching again
  if (appStore.coreSetting) {
    const coreData = appStore.coreSetting;
    
    state.name = coreData.name;
    state.description = coreData.description;
    state.address = coreData.address;
    state.maps = coreData.maps;
    state.primary_color = coreData.primary_color;
    state.secondary_color = coreData.secondary_color;
    state.status_logo = '0';
    currentLogo.value = coreData.logo;
  }
  
  loading.data = false;
};

const handleSubmit = () => {
  v$.value.$touch();
  
  if (v$.value.$invalid) return;
  
  loading.submit = true;
  
  updateCoreSetting({
    name: state.name,
    logo: state.logo,
    description: state.description,
    address: state.address,
    maps: state.maps,
    primary_color: state.primary_color,
    secondary_color: state.secondary_color,
    status_logo: state.status_logo,
  })
    .then(({ data }) => {
      v$.value.$reset();
      swal.fire('Success', data.message || 'Core setting berhasil diupdate', 'success');
      
      // Update store with new data
      appStore.addCoreSetting(data.data);
      

      
      // Update current logo if new logo was uploaded
      if (state.logo) {
        // Create a temporary URL for preview
        currentLogo.value = URL.createObjectURL(state.logo);
      }
    })
    .catch((error) => {
      console.error('Error updating core setting:', error);
    })
    .finally(() => {
      loading.submit = false;
    });
};

// Watch for core setting changes in store
watch(
  () => appStore.coreSetting,
  (newV) => {
    if (newV) {
      fetchData();
    }
  },
  { immediate: true }
);

// Fetch data on component mount
onMounted(() => {
  v$.value.$touch();
});

// Cleanup object URLs on unmount
onUnmounted(() => {
  if (currentLogo.value && currentLogo.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentLogo.value);
  }
});
</script>

<style scoped>
.logo-container {
  position: relative;
  display: inline-block;
}

.logo-edit-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.logo-container:hover .logo-edit-btn {
  opacity: 1;
}
</style>
