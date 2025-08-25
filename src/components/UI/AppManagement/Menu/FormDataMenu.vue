<template>
  <v-form
    class="customP"
    @submit.prevent="submitForm"
  >
    <v-text-field
      v-model="state.key_menu"
      density="compact"
      name="key_menu"
      label="Key Name (Unique)"
      placeholder="Input Key Menu"
      variant="outlined"
      clearable
      :error-messages="v$.key_menu.$errors.map((e) => e.$message as string)"
      @blur="v$.key_menu.$touch()"
    />

    <v-text-field
      v-model="state.name"
      density="compact"
      class="mt-2"
      name="name"
      label="Name"
      placeholder="Input Name"
      variant="outlined"
      clearable
      :error-messages="v$.name.$errors.map((e) => e.$message as string)"
      @blur="v$.name.$touch()"
    />

    <v-text-field
      v-model="state.url"
      density="compact"
      name="url"
      label="URL"
      placeholder="Input URL"
      variant="outlined"
      class="mt-2"
      clearable
    />

    <v-btn
      type="submit"
      color="primary"
      class="mr-2 mt-2"
      :loading="resultLoading"
      :disabled="v$.$invalid"
    >
      Save
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import type { IMenu, IResponseMenu } from '@/model/menu-interface';
import { add, detail, update } from '@/service/AppManagement/menu';
import { rules } from '@/utils/appmanagement/menu/form';
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import { getProfile } from '@/utils/tools';
import useVuelidate from '@vuelidate/core';

const swal = inject('$swal') as typeof import('sweetalert2').default;

// props
const emit = defineEmits(emitsGlobal);

// loading
const props = defineProps(propsForm<IResponseMenu>());
const { loading, resultLoading } = useLoadingForm();

// state
const state = reactive<IMenu>({
  key_menu: '',
  name: '',
  url: '',
});

// rules
const v$ = useVuelidate(rules, state);

const submitForm = () => {
  emit('changeLoading', true);
  loading.submit = true;

  const payload = {
    ...state,
    menu_id: props.id,
  };

  let formType

  if (props.selectData === null) {
    formType = add(payload)
  } else {
    formType = update(props.selectData.id, payload)
  }

  formType
    .then(({ data }) => {
      v$.value.$reset();
      swal.fire('Success', data.message, 'success');
      return getProfile();
    })
    .then(() => {
      emit('refreshPage');
    })
    .finally(() => {
      emit('changeLoading', false);
      loading.submit = false;
    });
};

const fetchForm = () => {
  v$.value.$touch();

  if (props.selectData) {
    loading.data = true;
    detail(props.selectData.id)
      .then(({ data }) => {
        Object.assign(state, {
          ...data.data,
        });
      })
      .finally(() => (loading.data = false));
  }
};

fetchForm();
</script>
