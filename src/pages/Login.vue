<template>
  <div
    class="d-flex align-center justify-center pa-4"
    :style="{
      minHeight: '100vh',
      background: `radial-gradient(circle at center, ${primaryColor} 0%, ${secondaryColor} 100%)`
    }"
  >
    <div 
      class="pa-4 pa-md-6 rounded-lg elevation-12 bg-white" 
      :style="{
        width: '100%',
        maxWidth: '400px'
      }"
    >
      <!-- Logo and App Name -->
      <div class="d-flex align-center justify-center mb-4">
        <!-- Logo -->
        <div
          v-if="logoUrl && logoUrl !== ''"
          class="mr-3"
        >
          <img
            :src="logoUrl"
            alt="Logo"
            style="height: 50px; width: 50px; object-fit: contain;"
            @error="logoUrl = ''"
          >
        </div>
        
        <!-- App Name -->
        <div class="font-18 font-md-20 font-weight-bold">
          {{ appName }}
        </div>
      </div>
      
      <!-- Sign In Title -->
      <div class="font-20 font-md-24 font-weight-bold text-center mb-4 mb-md-6">
        Sign In
      </div>

      <v-form
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="state.email"
          data-testid="email-field"
          class="mt-2"
          density="compact"
          name="email"
          label="Email"
          placeholder="Input Email"
          variant="outlined"
          clearable
          :error-messages="v$.email.$errors.map(e => e.$message as string)"
          @blur="v$.email.$touch()"
        />

        <v-text-field
          v-model="state.password"
          data-testid="password-field"
          density="compact"
          label="Password"
          class="mt-2"
          placeholder="Input password"
          :type="fieldPassword ? 'text' : 'password'"
          :append-inner-icon="fieldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          variant="outlined"
          clearable
          :error-messages="v$.password.$errors.map((e) => e.$message as string)"
          @click:append-inner="fieldPassword = !fieldPassword"
          @blur="v$.password.$touch()"
        />

        <v-btn
          data-testid="btn-submit"
          class="mt-4 text-none"
          type="submit"
          rounded
          color="primary"
          :loading="resultLoading"
          :disabled="v$.$invalid"
          block
          size="large"
        >
          Login Now!
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/service/auth';
import { getCoreSetting } from '@/service/Setting/core';
import { useLoading } from '@/utils/loading';
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { useLocalStorage } from '@vueuse/core';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

// loading
const { resultLoading, loading } = useLoading();

// data
const fieldPassword = ref(false);
const primaryColor = ref('#f86f24');
const secondaryColor = ref('#efbc37');
const logoUrl = ref('');
const appName = ref('-');

const state = reactive({
  email: '',
  password: '',
});

//rules
const rules = {
  email: {
    required: helpers.withMessage('Email is Required', required),
    email: helpers.withMessage('Must e-mail format', email),
  },
  password: {
    required: helpers.withMessage('Password is Required', required),
  },
};

const v$ = useVuelidate(rules, state);

// Watch for core setting changes
watch(
  () => store.coreSetting,
  (newV) => {
    if (newV) {
      primaryColor.value = newV.primary_color || '#f86f24';
      secondaryColor.value = newV.secondary_color || '#efbc37';
      logoUrl.value = newV.logo || '';
      appName.value = newV.name || '-';
      console.log('Core setting loaded:', { logo: newV.logo, name: newV.name });
    }
  },
  { deep: true, immediate: true }
);

// Fallback: jika store belum ter-load, panggil service langsung
const fetchCoreSettingFallback = () => {
  if (!store.coreSetting || !store.coreSetting.name) {
    getCoreSetting()
      .then(({ data }) => {
        if (data.data) {
          primaryColor.value = data.data.primary_color || '#f86f24';
          secondaryColor.value = data.data.secondary_color || '#efbc37';
          logoUrl.value = data.data.logo || '';
          appName.value = data.data.name || '-';
          console.log('Fallback core setting loaded:', { logo: data.data.logo, name: data.data.name });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

onMounted(() => {
  fetchCoreSettingFallback();
});

const submitForm = () => {
  loading.submit = true;
  
  const payload = { ...state };
  
  state.email = '';
  state.password = '';
  
  v$.value.$reset();

  login(payload)
    .then(({ data: { refresh_token } }) => {
      useLocalStorage('refresh_token', refresh_token);
      const redirect =
        ((Array.isArray(route.query.redirect)
          ? route.query.redirect[0]
          : route.query.redirect) as string) || '/home';
      router.push(redirect);
    })
    .catch(() => {})
    .finally(() => {
      loading.submit = false;
    });
};

</script>
