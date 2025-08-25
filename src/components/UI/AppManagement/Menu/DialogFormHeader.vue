<template>
  <v-card>
    <div class="pa-6 bg-white rounded-lg">
      <v-row class="d-flex align-center">
        <v-col cols="6">
          <div class="font-24 font-weight-bold">
            Change Parent Menu
          </div>
        </v-col>
        <v-col
          cols="6"
          class="text-right"
        >
          <v-btn
            variant="text"
            color="primary"
            class="mr-2 mb-2"
            icon="mdi-close"
            :loading="resultLoading"
            @click="$emit('closeDialog')"
          />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col
          cols="12"
          md="8"
        >
          <div class="elevation-3 rounded-lg pa-4">
            <v-text-field
              v-model="stateParams.search"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              clearable
              @change="refreshPage"
              @click:clear="refreshPage"
            />
            <v-btn
              class="mb-2 mr-2 text-capitalize"
              density="compact"
              color="primary"
              :loading="resultLoading"
              @click="changeParentMenu()"
            >
              No Parent
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="elevation-3 rounded-lg pa-4">
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
                <v-btn
                  class="mb-2 mr-2 text-capitalize"
                  density="compact"
                  color="primary"
                  :loading="resultLoading"
                  @click="changeParentMenu(item.id)"
                >
                  Select
                </v-btn>
              </template>
            </v-data-table-server>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import type { IResponseMenu } from '@/model/menu-interface';
import type { IDefaultParams } from '@/model/utils-interface';
import { changeParent, listHeader } from '@/service/AppManagement/menu';
import { useTable } from '@/utils/appmanagement/menu/list';
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import { getProfile } from '@/utils/tools';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;
const { smAndDown, mdAndUp } = useDisplay();

// props
const props = defineProps(propsForm<IResponseMenu>());
const emit = defineEmits(emitsGlobal);

// loading
const { loading, resultLoading } = useLoadingForm();

// table
const { headers, itemsPerPageOptions } = useTable(mdAndUp.value);
const items = ref<IResponseMenu[]>([]);
const total = ref<number>(0);

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

const changeParentMenu = (menu_id: number | null = null) => {
  loading.submit = true;

  const payload = {
    menu_id,
  };

  changeParent(props.id, payload)
    .then(({ data }) => {
      swal.fire('Success', data.message, 'success');
      return getProfile();
    })
    .then(() => {
      emit('refreshPage');
      emit('closeDialog');
    })
    .catch(() => {})
    .finally(() => {
      loading.submit = false;
    });
};

const fetchData = () => {
  loading.data = true;
  items.value = [];
  listHeader(props.id, stateParams)
    .then(({ data }) => {
      items.value = [];
      items.value = data.data;
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

  if (options.length !== 0) {
    stateParams.order_field = options[0].key;
    stateParams.order_dir = options[0].order;
  }

  refreshPage();
};

const fetchForm = () => {
  refreshPage();
};

fetchForm();
</script>
