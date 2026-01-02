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
              {{ props.selectData ? 'Edit Jadwal Latihan' : 'Add Jadwal Latihan' }}
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
              :disabled="resultLoading"
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
            <v-select
              v-model="state.day_of_week"
              density="compact"
              label="Hari"
              variant="outlined"
              :items="dayOfWeekOptions"
              item-title="title"
              item-value="value"
              :error-messages="mapErrors(v$.day_of_week.$errors)"
              @blur="v$.day_of_week.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="state.start_time"
              density="compact"
              label="Start Time"
              variant="outlined"
              type="time"
              :error-messages="mapErrors(v$.start_time.$errors)"
              @blur="v$.start_time.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="state.end_time"
              density="compact"
              label="End Time"
              variant="outlined"
              type="time"
              :error-messages="mapErrors(v$.end_time.$errors)"
              @blur="v$.end_time.$touch()"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="state.category"
              density="compact"
              label="Category"
              variant="outlined"
              clearable
              :error-messages="mapErrors(v$.category.$errors)"
              @blur="v$.category.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="memberSelectionLabel"
              density="compact"
              label="Pelatih (Optional)"
              variant="outlined"
              clearable
              readonly
              bg-color="grey-lighten-2"
              data-testid="coach-selection-field"
              :append-inner-icon="resultLoading ? undefined : 'mdi-account-search'"
              @click:append-inner="openMemberDialog"
              @click:clear="clearSelectedMember"
            />

            <v-btn
              data-testid="open-coach-selection-btn"
              class="mt-2 text-none"
              density="compact"
              color="primary"
              variant="outlined"
              :loading="resultLoading"
              :disabled="resultLoading"
              @click="openMemberDialog"
            >
              Pilih Pelatih
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-row :dense="true">
              <v-col cols="12">
                <v-text-field
                  :model-value="memberName"
                  density="compact"
                  label="Nama Pelatih"
                  variant="outlined"
                  readonly
                  bg-color="grey-lighten-2"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :model-value="memberUsername"
                  density="compact"
                  label="Username Pelatih"
                  variant="outlined"
                  readonly
                  bg-color="grey-lighten-2"
                  hide-details
                />
              </v-col>
            </v-row>
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

    <MemberSelectionDialog
      v-model="statusMemberDialog"
      :disabled="resultLoading"
      @select="handleMemberSelected"
      @update:loading="setMemberDialogLoading"
    />
  </v-card>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { useLoadingForm } from '@/utils/loading';
import type { ITrainingSchedule, ITrainingScheduleUpsertPayload, IRequestTrainingScheduleForm } from '@/model/training-schedule-interface';
import { createTrainingSchedule, getTrainingScheduleDetail, updateTrainingSchedule } from '@/service/Setting/trainingSchedules';
import { rules } from '@/utils/setting/training-schedules/form';
import type { IResponseMember } from '@/model/member-interface';
import MemberSelectionDialog from '@/components/UI/Setting/Landing/AboutTeamMembers/MemberSelectionDialog.vue';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const props = defineProps<{
  selectData: ITrainingSchedule | null;
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
  (e: 'refreshPage'): void;
}>();

const { loading, resultLoading } = useLoadingForm();

const state = reactive<IRequestTrainingScheduleForm>({
  day_of_week: null,
  start_time: '',
  end_time: '',
  category: '',
  member_id: null,
  is_published: true,
});

const dayOfWeekOptions = [
  { title: 'Senin', value: 1 },
  { title: 'Selasa', value: 2 },
  { title: 'Rabu', value: 3 },
  { title: 'Kamis', value: 4 },
  { title: 'Jumat', value: 5 },
  { title: 'Sabtu', value: 6 },
  { title: 'Minggu', value: 7 },
];

const memberName = ref<string>('-');
const memberUsername = ref<string>('-');

const v$ = useVuelidate(rules, state);

const mapErrors = (errors: Array<{ $message: unknown }>) => errors.map((err) => String(err.$message));

const memberSelectionLabel = computed(() => {
  if (state.member_id === null) return '';
  if (memberName.value !== '-' && memberUsername.value !== '-') {
    return `${memberName.value} (${memberUsername.value})`;
  }
  return `Member ID: ${state.member_id}`;
});

const statusMemberDialog = ref(false);

const openMemberDialog = () => {
  statusMemberDialog.value = true;
};

const setMemberDialogLoading = (val: boolean) => {
  loading.member = val;
};

const handleMemberSelected = (item: IResponseMember) => {
  state.member_id = item.id;
  memberName.value = item.name;
  memberUsername.value = item.username;
};

const clearSelectedMember = () => {
  state.member_id = null;
  memberName.value = '-';
  memberUsername.value = '-';
};

const resetForm = () => {
  state.day_of_week = null;
  state.start_time = '';
  state.end_time = '';
  state.category = '';
  state.member_id = null;
  state.is_published = true;
  memberName.value = '-';
  memberUsername.value = '-';
  v$.value.$reset();
};

const fetchForm = () => {
  v$.value.$touch();

  if (!props.selectData) {
    resetForm();
    return;
  }

  loading.data = true;
  getTrainingScheduleDetail(props.selectData.id)
    .then(({ data }) => {
      state.day_of_week = data.data.day_of_week;
      state.start_time = data.data.start_time;
      state.end_time = data.data.end_time;
      state.category = data.data.category;
      state.member_id = data.data.member_id;
      state.is_published = data.data.is_published;
      memberName.value = data.data.member?.name || '-';
      memberUsername.value = data.data.member?.username || '-';
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
  if (state.day_of_week === null) return;

  const payload: ITrainingScheduleUpsertPayload = {
    day_of_week: state.day_of_week,
    start_time: state.start_time,
    end_time: state.end_time,
    category: state.category,
    member_id: state.member_id,
    is_published: state.is_published,
  };

  loading.submit = true;

  const request = props.selectData
    ? updateTrainingSchedule(props.selectData.id, payload)
    : createTrainingSchedule(payload);

  request
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Data berhasil disimpan', 'success');
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
