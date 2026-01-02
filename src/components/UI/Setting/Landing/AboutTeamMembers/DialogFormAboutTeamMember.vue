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
              {{ props.selectData ? 'Edit Pengurus & Pelatih' : 'Add Pengurus & Pelatih' }}
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
              :loading="formActionResultLoading"
              @click="emit('closeDialog')"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              class="mr-2 mb-2"
              :loading="formActionResultLoading"
              :disabled="v$.$invalid || formActionResultLoading"
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
              :model-value="memberSelectionLabel"
              density="compact"
              label="Member"
              variant="outlined"
              clearable
              :error-messages="v$.member_id.$errors.map((e) => e.$message as string)"
              readonly
              bg-color="grey-lighten-2"
              data-testid="member-selection-field"
              :append-inner-icon="resultLoading ? undefined : 'mdi-account-search'"
              @blur="v$.member_id.$touch()"
              @click:append-inner="openMemberDialog"
              @click:clear="clearSelectedMember"
            />

            <v-btn
              data-testid="open-member-selection-btn"
              class="mt-2 text-none"
              density="compact"
              color="primary"
              variant="outlined"
              :loading="memberDialogResultLoading"
              :disabled="resultLoading"
              @click="openMemberDialog"
            >
              Pilih Member
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="state.role"
              density="compact"
              label="Role"
              variant="outlined"
              clearable
              :error-messages="v$.role.$errors.map((e) => e.$message as string)"
              @blur="v$.role.$touch()"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="memberName"
              density="compact"
              label="Member Name"
              variant="outlined"
              readonly
              bg-color="grey-lighten-2"
              hide-details
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="memberUsername"
              density="compact"
              label="Member Username"
              variant="outlined"
              readonly
              bg-color="grey-lighten-2"
              hide-details
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
import { createAboutTeamMember, getAboutTeamMemberDetail, updateAboutTeamMember } from '@/service/Setting/aboutTeamMembers';
import type {
  IAboutTeamMember,
  IAboutTeamMemberUpsertPayload,
  IRequestAboutTeamMemberForm,
} from '@/model/about-team-member-interface';
import { rules } from '@/utils/setting/about-team-members/form';
import type { IResponseMember } from '@/model/member-interface';
import MemberSelectionDialog from '@/components/UI/Setting/Landing/AboutTeamMembers/MemberSelectionDialog.vue';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const props = defineProps<{
  selectData: IAboutTeamMember | null;
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
  (e: 'refreshPage'): void;
}>();

const { loading, resultLoading } = useLoadingForm();
const formActionResultLoading = computed(() => loading.data || loading.submit);
const memberDialogResultLoading = computed(() => loading.member);

const state = reactive<IRequestAboutTeamMemberForm>({
  member_id: null,
  role: '',
  is_published: true,
});

const memberName = ref<string>('-');
const memberUsername = ref<string>('-');

const v$ = useVuelidate(rules, state);

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
  v$.value.member_id.$touch();
};

const clearSelectedMember = () => {
  state.member_id = null;
  memberName.value = '-';
  memberUsername.value = '-';
  v$.value.member_id.$touch();
};

const resetForm = () => {
  state.member_id = null;
  state.role = '';
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
  getAboutTeamMemberDetail(props.selectData.id)
    .then(({ data }) => {
      state.member_id = data.data.member_id;
      state.role = data.data.role;
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
  if (state.member_id === null) return;

  const payload: IAboutTeamMemberUpsertPayload = {
    member_id: state.member_id,
    role: state.role,
    is_published: state.is_published,
  };

  loading.submit = true;

  const request = props.selectData
    ? updateAboutTeamMember(props.selectData.id, payload)
    : createAboutTeamMember(payload);

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
