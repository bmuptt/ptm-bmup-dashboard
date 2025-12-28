<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-form @submit.prevent="submitForm">
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <div class="font-24 font-weight-bold">
              Form Member
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
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="state.username"
              class="mt-2"
              density="compact"
              name="username"
              label="Username"
              variant="outlined"
              clearable
              :readonly="isUsernameReadonly"
              :bg-color="isUsernameReadonly ? 'grey-lighten-2' : undefined"
              :error-messages="v$.username.$errors.map((e) => e.$message as string)"
              @blur="v$.username.$touch()"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="state.gender"
              class="mt-2"
              density="compact"
              name="gender"
              label="Gender"
              variant="outlined"
              :items="genderOptions"
              :error-messages="v$.gender.$errors.map((e) => e.$message as string)"
              @blur="v$.gender.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="state.birthdate"
              class="mt-2"
              density="compact"
              name="birthdate"
              label="Birthdate"
              variant="outlined"
              type="date"
              :error-messages="v$.birthdate.$errors.map((e) => e.$message as string)"
              @blur="v$.birthdate.$touch()"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="6"
          >
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
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-switch
              v-model="state.active"
              class="mt-2"
              label="Active"
              color="primary"
              hide-details
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="state.address"
              class="mt-2"
              density="compact"
              name="address"
              label="Address"
              variant="outlined"
              rows="3"
              clearable
              :error-messages="v$.address.$errors.map((e) => e.$message as string)"
              @blur="v$.address.$touch()"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-center">
              <div class="photo-container position-relative mr-4">
                <v-img
                  :src="currentPhoto || '/static/img/no_image.png'"
                  width="120"
                  height="120"
                  cover
                  class="rounded border"
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  class="photo-edit-btn"
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
                  v-if="currentPhoto && currentPhoto !== '/static/img/no_image.png'"
                  color="error"
                  variant="outlined"
                  size="small"
                  class="mt-2"
                  @click="deletePhoto"
                >
                  Hapus Photo
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { useLoadingComponent } from '@/utils/loading';
import { add, update, detail } from '@/service/Setting/member';
import type { IResponseMember, IRequestMember } from '@/model/member-interface';
import { rules } from '@/utils/setting/member/form';

// SweetAlert
const swal = inject('$swal') as typeof import('sweetalert2').default;

// props
const props = defineProps<{
  selectData: IResponseMember | null;
}>();

// emits
const emit = defineEmits(['closeDialog', 'refreshPage']);

// loading
const { loading, resultLoading } = useLoadingComponent();

// data
const state = reactive<IRequestMember>({
  name: '',
  username: '',
  gender: '',
  birthdate: '',
  address: '',
  phone: '',
  photo: null,
  status_photo: '0',
  active: true,
});

// validation rules imported from utils

// vuelidate
const v$ = useVuelidate(rules, state);

// photo handling
const currentPhoto = ref<string>('');
const fileInputRef = ref<HTMLInputElement | null>(null);

// computed
const isUsernameReadonly = computed(() => {
  return props.selectData?.user_id !== null && props.selectData?.user_id !== undefined;
});

// gender options
const genderOptions = [
  { title: 'Male', value: 'Male' },
  { title: 'Female', value: 'Female' },
];

// methods
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

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    console.error('Invalid file type. Only JPEG, PNG, JPG, GIF are allowed.');
    target.value = '';
    return;
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    console.error('File size too large. Maximum size is 2MB.');
    target.value = '';
    return;
  }

  if (currentPhoto.value && currentPhoto.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentPhoto.value);
  }

  state.photo = file;
  state.status_photo = '1';
  currentPhoto.value = URL.createObjectURL(file);
  target.value = '';
};

const deletePhoto = () => {
  state.photo = null;
  state.status_photo = '1';
  if (currentPhoto.value && currentPhoto.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentPhoto.value);
  }
  currentPhoto.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const submitForm = () => {
  v$.value.$touch();
  
  if (v$.value.$invalid) return;
  
  loading.submit = true;
  
  const formData = new FormData();
  formData.append('name', state.name);
  formData.append('username', state.username);
  formData.append('gender', state.gender);
  formData.append('birthdate', state.birthdate);
  formData.append('address', state.address);
  formData.append('phone', state.phone);
  formData.append('active', state.active.toString());
  
  if (state.photo) {
    formData.append('photo', state.photo);
  }
  
  // Add status_file for update
  if (props.selectData) {
    formData.append('status_file', state.status_photo);
  }
  
  const submitAction = props.selectData 
    ? update(props.selectData.id, formData)
    : add(formData);
  
  submitAction
    .then(({ data }) => {
      v$.value.$reset();
      swal.fire('Success', data.message, 'success');
      emit('refreshPage');
      emit('closeDialog');
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.submit = false;
    });
};

// Fetch form data when editing
const fetchForm = () => {
  v$.value.$touch();
  
  if (props.selectData) {
    loading.data = true;
    detail(props.selectData.id)
      .then(({ data }) => {
        // Format birthdate to YYYY-MM-DD for input type="date"
        let birthdate = '';
        if (data.data.birthdate) {
          // Check if already in YYYY-MM-DD format
          if (/^\d{4}-\d{2}-\d{2}$/.test(data.data.birthdate)) {
            birthdate = data.data.birthdate;
          } else {
            // Convert other date formats to YYYY-MM-DD
            try {
              const date = new Date(data.data.birthdate);
              if (!isNaN(date.getTime())) {
                birthdate = date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.error('Error parsing birthdate:', e);
            }
          }
        }
        
        state.name = data.data.name;
        state.username = data.data.username;
        state.gender = data.data.gender;
        state.birthdate = birthdate;
        state.address = data.data.address;
        state.phone = data.data.phone;
        state.active = data.data.active;
        state.status_photo = '0';
        if (currentPhoto.value && currentPhoto.value.startsWith('blob:')) {
          URL.revokeObjectURL(currentPhoto.value);
        }
        currentPhoto.value = data.data.photo || '';
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        loading.data = false;
      });
  } else {
    // Reset form for new member
    state.name = '';
    state.username = '';
    state.gender = '';
    state.birthdate = '';
    state.address = '';
    state.phone = '';
    state.photo = null;
    state.status_photo = '0';
    state.active = true;
    currentPhoto.value = '';
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

// Fetch form data on mount
onMounted(() => {
  v$.value.$touch();
  fetchForm();
  
  if (currentPhoto.value && currentPhoto.value.startsWith('blob:')) {
    URL.revokeObjectURL(currentPhoto.value);
  }
});

// Watch for selectData changes (for when dialog is reopened)
watch(
  () => props.selectData,
  () => {
    fetchForm();
  }
);
</script>

<style scoped>
.photo-container {
  position: relative;
}

.photo-edit-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
}
</style>
