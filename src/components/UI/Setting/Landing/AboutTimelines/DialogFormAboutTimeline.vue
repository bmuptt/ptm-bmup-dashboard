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
              {{ props.selectData ? 'Edit Timeline' : 'Add Timeline' }}
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
            md="4"
          >
            <v-text-field
              v-model.number="state.year"
              density="compact"
              label="Year"
              variant="outlined"
              clearable
              type="number"
              :error-messages="v$.year.$errors.map((e) => e.$message as string)"
              @blur="v$.year.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="8"
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
              v-model="state.description"
              density="compact"
              label="Description"
              variant="outlined"
              clearable
              rows="5"
              auto-grow
              :error-messages="v$.description.$errors.map((e) => e.$message as string)"
              @blur="v$.description.$touch()"
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
import { createAboutTimeline, getAboutTimelineDetail, updateAboutTimeline } from '@/service/Setting/aboutTimelines';
import type { IAboutTimeline, IAboutTimelineUpsertPayload, IRequestAboutTimelineForm } from '@/model/about-timeline-interface';
import { rules } from '@/utils/setting/about-timelines/form';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const props = defineProps<{
  selectData: IAboutTimeline | null;
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
  (e: 'refreshPage'): void;
}>();

const { loading, resultLoading } = useLoadingForm();

const state = reactive<IRequestAboutTimelineForm>({
  year: null,
  title: '',
  description: '',
  is_published: true,
});

const v$ = useVuelidate(rules, state);

const resetForm = () => {
  state.year = null;
  state.title = '';
  state.description = '';
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
  getAboutTimelineDetail(props.selectData.id)
    .then(({ data }) => {
      state.year = data.data.year;
      state.title = data.data.title;
      state.description = data.data.description;
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
  if (state.year === null) return;

  const payload: IAboutTimelineUpsertPayload = {
    year: state.year,
    title: state.title,
    description: state.description,
    is_published: state.is_published,
  };

  loading.submit = true;

  const request = props.selectData
    ? updateAboutTimeline(props.selectData.id, payload)
    : createAboutTimeline(payload);

  request
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Timeline berhasil disimpan', 'success');
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

