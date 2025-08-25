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
        md="8"
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
      <v-col cols="12">
        <v-btn
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
            <template #[`item.actions`]="{ item }">
              <v-menu>
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
                    link
                    @click="openDialogForm(item)"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="submitResetPassword(item.id)"
                  >
                    <v-list-item-title>Reset Password</v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    v-if="item.active !== 'Take Out'"
                    link
                    @click="submitTakeOut(item.id)"
                  >
                    <v-list-item-title>Take Out</v-list-item-title>
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
        :item-list-role="itemListRole"
        @close-dialog="closeDialogForm"
        @refresh-page="refreshPage"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { IResponseUser } from '@/model/user-interface';
import { list, resetPassword, takeOut } from '@/service/AppManagement/user';
import { useTable } from '@/utils/appmanagement/user/list';
import { useLoadingComponent } from '@/utils/loading';
import { useDisplay } from 'vuetify';
import DialogForm from '@/components/UI/AppManagement/User/DialogFormUser.vue';
import { list as listRole } from '@/service/AppManagement/role';
import type { IDefaultParams } from '@/model/utils-interface';

const route = useRoute();
const { smAndDown, mdAndUp } = useDisplay();
const swal = inject('$swal') as typeof import('sweetalert2').default;

// loading
const { loading, resultLoading } = useLoadingComponent();

// table
const { headers, itemsPerPageOptions } = useTable(mdAndUp.value);
const items = ref<IResponseUser[]>([]);
const total = ref<number>(0);

// dialog
const selectData = ref<IResponseUser | null>(null);
const statusDialogForm = ref(false);

// list
const itemListRole = ref([]);

// params
const stateParams = reactive<IDefaultParams>({
  search: '',
  order_field: null,
  order_dir: null,
  page: 1,
  per_page: 10,
});

// watch
watch(
  () => stateParams.page,
  () => {
    fetchData();
  }
);

const fetchRole = () => {
  loading.role = true;
  itemListRole.value = [];

  const params = {
    page: 1,
    per_page: 1000,
  }

  listRole(params)
    .then(({ data }) => {
      itemListRole.value = data.data;
    })
    .finally(() => (loading.role = false));
};

const submitResetPassword = (id: number) => {
  loading.submit = true;

  resetPassword(id)
    .then(({ data }) => {
      swal.fire('Success', data.message, 'success');
      refreshPage();
    })
    .finally(() => (loading.submit = false));
};

const submitTakeOut = (id: number) => {
  loading.submit = true;

  takeOut(id)
    .then(({ data }) => {
      swal.fire('Success', data.message, 'success');
      refreshPage();
    })
    .finally(() => (loading.submit = false));
};

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: IResponseUser | null = null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const fetchData = async () => {
  loading.data = true;

  list(stateParams)
    .then(({ data }) => {
      items.value = data.data;
      total.value = data.total;
    })
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

  if (options.length !== 0) {
    stateParams.order_field = options[0].key;
    stateParams.order_dir = options[0].order;
  }

  refreshPage();
};

fetchRole();
fetchData();
</script>
