<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-form @submit.prevent="submitForm">
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <div class="font-24 font-weight-bold">
              Form
              {{ route.matched[2]?.meta?.label || 'Branch' }}
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
              @click="$emit('closeDialog')"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              class="mr-2 mb-2"
              :loading="resultLoading"
              :disabled="v$.$invalid"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="state.code"
              class="mt-2"
              density="compact"
              name="code"
              label="Code"
              variant="outlined"
              clearable
              :error-messages="v$.code.$errors.map((e) => e.$message as string)"
              @blur="v$.code.$touch()"
            />

            <v-text-field
              v-model="state.name"
              class="mt-2"
              density="compact"
              name="name"
              label="Name"
              variant="outlined"
              clearable
              :error-messages="v$.name.$errors.map((e) => e.$message as string)"
              @blur="v$.name.$touch()"
            />

            <v-textarea
              v-model="state.alamat"
              class="mt-2"
              density="compact"
              name="alamat"
              label="Address"
              variant="outlined"
              clearable
              rows="3"
              :error-messages="v$.alamat.$errors.map((e) => e.$message as string)"
              @blur="v$.alamat.$touch()"
            />

            <v-text-field
              v-model="state.phone"
              class="mt-2"
              density="compact"
              name="phone"
              label="Phone"
              variant="outlined"
              clearable
              :error-messages="v$.phone.$errors.map((e) => e.$message as string)"
              @blur="v$.phone.$touch()"
            />

            <v-file-input
              v-model="state.logo"
              class="mt-2"
              density="compact"
              name="logo"
              label="Logo"
              variant="outlined"
              accept="image/*"
              prepend-icon="mdi-camera"
              :error-messages="v$.logo.$errors.map((e) => e.$message as string)"
              @blur="v$.logo.$touch()"
            />

            <v-text-field
              v-model="state.pic_id"
              class="mt-2"
              density="compact"
              name="pic_id"
              label="PIC ID"
              variant="outlined"
              type="number"
              clearable
              :error-messages="v$.pic_id.$errors.map((e) => e.$message as string)"
              @blur="v$.pic_id.$touch()"
              @update:model-value="(val) => state.pic_id = val ? Number(val) : null"
            />
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { rules } from '@/utils/master/branch/form';
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import useVuelidate from '@vuelidate/core';
import { store, update, show } from '@/service/Master/branch';
import type { IResponseBranch, IStateBranch } from '@/model/branch-interface';

const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;

// props
const props = defineProps(propsForm<IResponseBranch>());
const emit = defineEmits(emitsGlobal);

// loading
const { loading, resultLoading } = useLoadingForm();

// data
const state = reactive<IStateBranch>({
  code: '',
  name: '',
  alamat: '',
  phone: '',
  logo: null,
  pic_id: null,
  status_upload: 0
});

// Store original logo for comparison
const originalLogo = ref<string | null>(null);

// rules
const v$ = useVuelidate(rules, state);

const submitForm = () => {
  loading.submit = true;

  const formData = new FormData();
  formData.append('code', state.code);
  formData.append('name', state.name);
  formData.append('alamat', state.alamat);
  formData.append('phone', state.phone);
  if (state.pic_id) formData.append('pic_id', state.pic_id.toString());
  
  // Handle logo and status_upload logic
  if (props.selectData) {
    // Update mode
    if (state.logo) {
      // New file uploaded
      formData.append('logo', state.logo);
      formData.append('status_upload', '1');
    } else if (originalLogo.value && !state.logo) {
      // File was removed (original had logo but now empty)
      formData.append('status_upload', '2');
    } else {
      // No change to logo
      formData.append('status_upload', '0');
    }
  } else {
    // Create mode
    if (state.logo) {
      formData.append('logo', state.logo);
      formData.append('status_upload', '1');
    } else {
      formData.append('status_upload', '0');
    }
  }

  let type
  if (props.selectData) type = update(props.selectData.id, formData)
  else type = store(formData)

  if (type) {
    type
      .then(({ data }) => {
        v$.value.$reset();
        swal.fire('Success', data.message, 'success');
        emit('refreshPage');
        emit('closeDialog');
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        
        // Handle different types of errors
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          // Validation errors from backend
          const errorMessage = error.response.data.errors.join(', ');
          swal.fire('Validation Error', errorMessage, 'error');
        } else if (error.response?.data?.message) {
          // Custom error message from backend
          swal.fire('Error', error.response.data.message, 'error');
        } else if (error.message) {
          // Network or other errors
          swal.fire('Error', error.message, 'error');
        } else {
          // Generic error
          swal.fire('Error', 'Failed to save branch. Please try again.', 'error');
        }
      })
      .finally(() => (loading.submit = false));
  }
};

const fetchForm = () => {
  v$.value.$touch();

  if (props.selectData) {
    loading.data = true;
    show(props.selectData.id)
      .then(({ data }) => {
        Object.assign(state, {
          code: data.code,
          name: data.name,
          alamat: data.alamat,
          phone: data.phone,
          logo: null, // File input will be empty for edit
          pic_id: data.pic_id,
          status_upload: 0
        });
        // Store original logo for comparison
        originalLogo.value = data.logo;
      })
      .catch((error) => {
        console.error('Error fetching form data:', error);
        
        // Handle different types of errors
        if (error.response?.data?.message) {
          swal.fire('Error', error.response.data.message, 'error');
        } else if (error.message) {
          swal.fire('Error', error.message, 'error');
        } else {
          swal.fire('Error', 'Failed to load branch data. Please try again.', 'error');
        }
      })
      .finally(() => (loading.data = false));
  }
};

fetchForm();
</script>
