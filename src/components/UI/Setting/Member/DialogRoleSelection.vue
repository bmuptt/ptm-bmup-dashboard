<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4">
        <span class="font-20 font-weight-bold">Select Role</span>
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-text-field
          v-model="stateParams.search"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search roles..."
          clearable
          hide-details
          class="mb-4"
          @change="refreshPage"
          @click:clear="refreshPage"
        />
        
        <v-data-table-server
          v-model:items-per-page="stateParams.per_page"
          v-model:page="stateParams.page"
          :headers="headers"
          :items="roles"
          :items-length="total"
          :loading="resultLoading"
          density="compact"
          hover
          :items-per-page-options="itemsPerPageOptions"
          @update:sort-by="optionsSort"
          @update:items-per-page="optionsPerPage"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn
              color="primary"
              density="compact"
              @click="selectRole(item)"
            >
              Select
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          :loading="resultLoading"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { IResponseRole } from '@/model/role-interface';
import { list as listRoles } from '@/service/AppManagement/role';
import type { IDefaultParams } from '@/model/utils-interface';
import type { DialogRoleSelectionProps, DialogRoleSelectionEmits } from '@/model/dialog-interface';
import { useLoadingComponent } from '@/utils/loading';
import { useTable } from '@/utils/setting/member/dialog-role-selection';

const props = defineProps<DialogRoleSelectionProps>();
const emit = defineEmits<DialogRoleSelectionEmits>();

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const roles = ref<IResponseRole[]>([]);
const total = ref<number>(0);
const stateParams = reactive<IDefaultParams>({
  search: '',
  order_field: null,
  order_dir: null,
  page: 1,
  per_page: 10,
});
const { loading, resultLoading } = useLoadingComponent();

// table
const { headers, itemsPerPageOptions } = useTable();

watch(dialogOpen, (newValue) => {
  if (newValue) {
    fetchRoles();
  } else {
    // Reset search when dialog closes
    stateParams.search = '';
    stateParams.page = 1;
  }
});

watch(() => stateParams.page, () => {
  fetchRoles();
});



const fetchRoles = () => {
  loading.role = true;

  listRoles(stateParams)
    .then(({ data }) => {
      roles.value = data.data;
      total.value = data.total;
    })
    .catch((error) => {
      console.error('Error fetching roles:', error);
    })
    .finally(() => {
      loading.role = false;
    });
};

const refreshPage = () => {
  stateParams.page = 1;
  fetchRoles();
};

const optionsPerPage = () => {
  stateParams.page = 1;
  fetchRoles();
};

const optionsSort = (sortBy: Array<{ key: string; order: 'asc' | 'desc' }>) => {
  if (sortBy.length > 0) {
    stateParams.order_field = sortBy[0].key;
    stateParams.order_dir = sortBy[0].order;
  } else {
    stateParams.order_field = null;
    stateParams.order_dir = null;
  }
  stateParams.page = 1;
  fetchRoles();
};



const selectRole = (item: IResponseRole) => {
  emit('roleSelected', item);
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
};
</script>

<style scoped>
/* Add any specific styles for role selection dialog here */
</style>