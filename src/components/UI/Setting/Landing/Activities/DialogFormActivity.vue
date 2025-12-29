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
              {{ props.selectData ? 'Edit Activity' : 'Add Activity' }}
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
          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="state.icon_id"
              density="compact"
              label="Icon"
              variant="outlined"
              clearable
              :items="props.icons"
              item-title="label"
              item-value="id"
              :error-messages="v$.icon_id.$errors.map((e) => e.$message as string)"
              @blur="v$.icon_id.$touch()"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <template #prepend>
                    <v-icon :icon="item.raw.name" />
                  </template>
                  <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.raw.name }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
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
            <v-textarea
              v-model="state.subtitle"
              density="compact"
              label="Subtitle"
              variant="outlined"
              clearable
              rows="4"
              auto-grow
              :error-messages="v$.subtitle.$errors.map((e) => e.$message as string)"
              @blur="v$.subtitle.$touch()"
            />
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
import { createLandingActivity, getLandingActivityDetail, updateLandingActivity } from '@/service/Setting/landingActivities';
import type { ILandingActivity, ILandingActivityUpsertPayload, ILandingIcon, IRequestLandingActivity } from '@/model/landing-activity-interface';
import { rules } from '@/utils/setting/activities/form';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const props = defineProps<{
  selectData: ILandingActivity | null;
  icons: ILandingIcon[];
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
  (e: 'refreshPage'): void;
}>();

const { loading, resultLoading } = useLoadingForm();

const state = reactive<IRequestLandingActivity>({
  icon_id: null,
  title: '',
  subtitle: '',
  is_published: true,
});

const v$ = useVuelidate(rules, state);

const resetForm = () => {
  state.icon_id = null;
  state.title = '';
  state.subtitle = '';
  state.is_published = true;
  v$.value.$reset();
};

const fetchForm = () => {
  v$.value.$touch();

  if (!props.selectData) {
    resetForm();
    return;
  }

  loading.data = true;
  getLandingActivityDetail(props.selectData.id)
    .then(({ data }) => {
      state.icon_id = data.data.icon_id;
      state.title = data.data.title;
      state.subtitle = data.data.subtitle;
      state.is_published = data.data.is_published;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.data = false;
    });
};

const submitForm = () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  const iconId = state.icon_id === null ? '' : String(state.icon_id);
  const payload: ILandingActivityUpsertPayload = {
    icon_id: iconId,
    title: state.title,
    subtitle: state.subtitle,
    is_published: state.is_published,
  };

  loading.submit = true;

  const request = props.selectData
    ? updateLandingActivity(props.selectData.id, payload)
    : createLandingActivity(payload);

  request
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Activity berhasil disimpan', 'success');
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
