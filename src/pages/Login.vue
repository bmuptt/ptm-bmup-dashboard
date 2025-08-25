<template>
  <div>
    <v-row class="ma-0">
      <v-col
        class="d-none d-sm-none d-md-block pa-0"
        md="6"
      >
        <div
          class="pos-relative background-no-repeat background-position-center background-size-cover"
          :style="{
            height: '100vh',
            backgroundImage: 'url(./static/img/elinda-furniture.png)',
          }"
        />
      </v-col>

      <v-col
        class="px-6 pb-3 background-no-repeat background-position-center background-size-cover background-none-mobile"
        md="6"
        cols="12"
        :style="{
          paddingTop: '25vh',
          height: '100vh',
          backgroundImage: `url(/static/img/elinda-furniture.png)`,
        }"
      >
        <div class="pa-4 rounded-lg elevation-6 bg-white">
          <div
            class="font-24 font-weight-bold"
          >
            Sign In
          </div>

          <v-form
            class="mt-4"
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
              class="mt-2 text-none"
              type="submit"
              rounded
              color="primary"
              :loading="resultLoading"
              :disabled="v$.$invalid"
            >
              Login Now!
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/service/auth';
import { useLoading } from '@/utils/loading';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { useLocalStorage } from '@vueuse/core';

const router = useRouter();
const route = useRoute();

// loading
const { resultLoading, loading } = useLoading();

// data
const fieldPassword = ref(false);

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
