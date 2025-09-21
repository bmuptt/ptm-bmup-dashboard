<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-form @submit.prevent="submitForm">
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <div class="font-24 font-weight-bold">
              Create User Account
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
              :disabled="!selectedRole"
            >
              Create User
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="memberData.name"
              class="mt-2 readonly-field"
              density="compact"
              name="name"
              label="Name"
              variant="outlined"
              readonly
              bg-color="grey-lighten-4"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="memberData.email"
              class="mt-2 readonly-field"
              density="compact"
              name="email"
              label="Email"
              variant="outlined"
              readonly
              bg-color="grey-lighten-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="selectedRoleName"
              class="mt-2"
              density="compact"
              name="role"
              label="Role"
              variant="outlined"
              readonly
            >
              <template #append>
                <v-btn
                  color="primary"
                  @click="openRoleDialog"
                >
                  ...
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <!-- Role Selection Dialog -->
    <DialogRoleSelection
      v-model="roleDialogOpen"
      @role-selected="handleRoleSelected"
    />
  </v-card>
</template>

<script lang="ts" setup>
import type { IResponseMember, IRequestCreateUser } from '@/model/member-interface';
import type { IResponseRole } from '@/model/role-interface';
import { createUser } from '@/service/Setting/member';
import { useLoadingComponent } from '@/utils/loading';
import DialogRoleSelection from './DialogRoleSelection.vue';

interface Props {
  memberData: IResponseMember;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  closeDialog: [];
  refreshPage: [];
}>();

const swal = inject('$swal') as typeof import('sweetalert2').default;
const { loading, resultLoading } = useLoadingComponent();

// Role selection
const roleDialogOpen = ref(false);
const selectedRole = ref<IResponseRole | null>(null);
const selectedRoleName = ref('');

const openRoleDialog = () => {
  roleDialogOpen.value = true;
};

const handleRoleSelected = (role: IResponseRole) => {
  selectedRole.value = role;
  selectedRoleName.value = role.name;
};

const submitForm = () => {
  if (!selectedRole.value) {
    swal.fire('Error', 'Please select a role', 'error');
    return;
  }

  loading.submit = true;

  const requestData: IRequestCreateUser = {
    member_id: props.memberData.id,
    role_id: selectedRole.value.id,
  };

  createUser(requestData)
    .then(({ data }) => {
      swal.fire('Success', data.message, 'success');
      emit('refreshPage');
      emit('closeDialog');
    })
    .catch(() => {})
    .finally(() => {
      loading.submit = false;
    });
};
</script>

<style scoped>
.readonly-field :deep(.v-field__input) {
  background-color: #f5f5f5 !important;
}

.readonly-field :deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 0.38;
}

.readonly-field :deep(.v-field--variant-outlined.v-field--focused .v-field__outline) {
  --v-field-border-width: 1px;
}
</style>