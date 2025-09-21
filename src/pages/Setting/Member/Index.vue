<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>

    <v-row
      class="mt-2"
      :dense="true"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="stateParams.search"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          clearable
          hide-details
          @change="refreshPage"
          @click:clear="refreshPage"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-select
          v-model="stateParams.active"
          density="compact"
          variant="outlined"
          label="Status"
          :items="statusOptions"
          hide-details
          @update:model-value="refreshPage"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          v-if="permission?.create"
          color="primary"
          density="compact"
          class="mt-2 mr-2 text-none"
          :loading="resultLoading"
          @click="openDialogForm()"
        >
          Add
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      class="mt-4"
      :dense="true"
    >
      <v-col cols="12">
        <div class="rounded-lg elevation-6 pa-4">
          <v-data-table-server
            v-model:items-per-page="stateParams.per_page"
            v-model:page="stateParams.page"
            :mobile="smAndDown"
            :hide-default-header="smAndDown"
            hover
            density="compact"
            :items-per-page-options="itemsPerPageOptions"
            :items-length="total"
            :headers="headers"
            :items="items"
            :loading="resultLoading"
            @update:sort-by="optionsSort"
            @update:items-per-page="optionsPerPage"
          >
            <template #[`item.photo`]="{ item }">
              <v-avatar size="40">
                <v-img
                  :src="item.photo || '/static/img/no_image.png'"
                  :alt="item.name"
                  cover
                />
              </v-avatar>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-menu v-if="permission?.update || permission?.delete">
                <template #activator="{ props }">
                  <v-btn
                    density="compact"
                    :loading="resultLoading"
                    v-bind="props"
                  >
                    Action
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-if="permission?.update"
                    link
                    @click="openDialogForm(item)"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="permission?.create && item.user_id === null && item.email"
                    link
                    @click="openCreateUserDialog(item)"
                  >
                    <v-list-item-title>Create User</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="permission?.delete"
                    link
                    @click="submitDelete(item.id)"
                  >
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table-server>
        </div>
      </v-col>
    </v-row>

    <v-dialog
      v-model="statusDialogForm"
      fullscreen
      persistent
      scrollable
    >
      <dialog-form
        v-if="statusDialogForm"
        :select-data="selectData"
        @close-dialog="closeDialogForm"
        @refresh-page="refreshPage"
      />
    </v-dialog>

    <v-dialog
      v-model="statusCreateUserDialog"
      fullscreen
      persistent
      scrollable
    >
      <dialog-create-user
        v-if="statusCreateUserDialog"
        :member-data="selectedMemberForUser!"
        @close-dialog="closeCreateUserDialog"
        @refresh-page="refreshPage"
      />
    </v-dialog>

    <confirm-dialog
      v-model="showDialog"
      :title="dialogOptions.title"
      :html="dialogOptions.html"
      :confirm-button-text="dialogOptions.confirmButtonText"
      :cancel-button-text="dialogOptions.cancelButtonText"
      :confirm-button-color="dialogOptions.confirmButtonColor"
      :icon="dialogOptions.icon"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IResponseMember } from '@/model/member-interface';
import { deleteData, list } from '@/service/Setting/member';
import { useLoadingComponent } from '@/utils/loading';
import { useDisplay } from 'vuetify';
import DialogForm from '../../../components/UI/Setting/Member/DialogFormMember.vue';
import DialogCreateUser from '../../../components/UI/Setting/Member/DialogCreateUser.vue';
import type { IDefaultParams } from '@/model/utils-interface';
import { useTable } from '@/utils/setting/member/list';
import type { IResPermission } from '@/model/auth-interface';
import { getPermission } from '@/service/auth';
import { getProfile } from '@/utils/tools';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const swal = inject('$swal') as typeof import('sweetalert2').default;
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();
const route = useRoute();
const { smAndDown, mdAndUp } = useDisplay();
const permission = ref<IResPermission | null>(null);

// loading
const { loading, resultLoading } = useLoadingComponent();

// table
const { headers, itemsPerPageOptions } = useTable(mdAndUp.value);
const items = ref<IResponseMember[]>([]);
const total = ref<number>(0);

// dialog
const selectData = ref<IResponseMember | null>(null);
const statusDialogForm = ref(false);

// create user dialog
const selectedMemberForUser = ref<IResponseMember | null>(null);
const statusCreateUserDialog = ref(false);

// params
const stateParams = reactive<IDefaultParams & { active?: string }>({
  search: '',
  order_field: null,
  order_dir: null,
  page: 1,
  per_page: 10,
  active: '',
});

// status options for filter
const statusOptions = [
  { title: 'All', value: '' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
];

// watch
watch(
  () => stateParams.page,
  () => {
    fetchData();
  }
);

// permission
const fetchPermission = () => {
  loading.permission = true;
  const paramsPermission = {
    key_menu: (route.matched[2]?.name as string) || '',
  };

  getPermission(paramsPermission)
    .then(({ data }) => {
      permission.value = data.data;
    })
    .catch(() => {})
    .finally(() => (loading.permission = false));
};

const submitDelete = async (id: number) => {
  const confirmed = await showConfirm({
    title: 'Delete Data',
    html: 'Are you sure you want to delete this data?',
    confirmButtonText: 'Yes',
    icon: 'warning'
  });

  if (confirmed) {
    loading.submit = true;

    deleteData(id)
      .then(({ data }) => {
        swal.fire('Success', data.message, 'success');
        return getProfile();
      })
      .then(() => {
        refreshPage();
      })
      .catch(() => {})
      .finally(() => (loading.submit = false));
  }
};

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: IResponseMember | null = null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const openCreateUserDialog = (data: IResponseMember) => {
  selectedMemberForUser.value = data;
  statusCreateUserDialog.value = true;
};

const closeCreateUserDialog = () => {
  statusCreateUserDialog.value = false;
  selectedMemberForUser.value = null;
};

const fetchData = async () => {
  loading.data = true;

  list(stateParams)
    .then(({ data }) => {
      items.value = data.data;
      total.value = data.pagination.total;
    })
    .catch(() => {})
    .finally(() => (loading.data = false));
};

const refreshPage = () => {
  if (stateParams.page !== 1) stateParams.page = 1;
  else fetchData();
};

const optionsPerPage = (options: number) => {
  stateParams.per_page = options;
  refreshPage();
};

const optionsSort = (
  options: Array<{ key: string; order: 'asc' | 'desc' }>
) => {
  stateParams.order_field = null;
  stateParams.order_dir = null;

  if (options.length !== 0 && options[0].key === 'name') {
    stateParams.order_field = options[0].key;
    stateParams.order_dir = options[0].order;
  }

  refreshPage();
};

fetchPermission();
fetchData();
</script>
