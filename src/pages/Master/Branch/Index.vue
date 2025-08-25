<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2]?.meta?.label || 'Branch Management' }}
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
          label="Search by name or code"
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
          Add Branch
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
  </div>
</template>

<script lang="ts" setup>
import type { IResponseBranch } from '@/model/branch-interface';
import { list, destroy } from '@/service/Master/branch';
import { useTable } from '@/utils/master/branch/list';
import { useLoadingComponent } from '@/utils/loading';
import { useDisplay } from 'vuetify';
import DialogForm from '@/components/UI/Master/Branch/DialogFormBranch.vue';
import type { IDefaultParams } from '@/model/utils-interface';

const route = useRoute();
const { smAndDown, mdAndUp } = useDisplay();
const swal = inject('$swal') as typeof import('sweetalert2').default;

// loading
const { loading, resultLoading } = useLoadingComponent();

// table
const { headers, itemsPerPageOptions } = useTable(mdAndUp.value);
const items = ref<IResponseBranch[]>([]);
const total = ref<number>(0);

// dialog
const selectData = ref<IResponseBranch | null>(null);
const statusDialogForm = ref(false);

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



const submitDelete = (id: number) => {
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      loading.submit = true;

      destroy(id)
        .then(({ data }) => {
          swal.fire('Deleted!', data.message, 'success');
          refreshPage();
        })
        .catch((error) => {
          console.error('Error deleting branch:', error);
          swal.fire('Error', 'Failed to delete branch. Please try again.', 'error');
        })
        .finally(() => (loading.submit = false));
    }
  });
};

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: IResponseBranch | null = null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const fetchData = async () => {
  loading.data = true;

  list(stateParams)
    .then(({ data }) => {
      items.value = data.data;
      // Handle different response structures
      if (data.meta && typeof data.meta.total === 'number') {
        total.value = data.meta.total;
      } else if (typeof data.total === 'number') {
        total.value = data.total;
      } else {
        total.value = data.data.length;
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      items.value = [];
      total.value = 0;
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

fetchData();
</script>
