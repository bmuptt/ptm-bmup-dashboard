<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="smAndDown"
    max-width="900"
    persistent
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="pa-4">
        <span class="font-20 font-weight-bold">Pilih Member</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-row :dense="true">
          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              v-model="memberParams.search"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              label="Search member..."
              clearable
              hide-details
              :disabled="disabled"
              @change="refreshMemberPage"
              @click:clear="refreshMemberPage"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="memberParams.active"
              density="compact"
              variant="outlined"
              label="Status"
              :items="memberStatusOptions"
              item-title="title"
              item-value="value"
              hide-details
              :disabled="disabled"
              @update:model-value="refreshMemberPage"
            />
          </v-col>
        </v-row>

        <v-data-table-server
          v-model:items-per-page="memberParams.per_page"
          v-model:page="memberParams.page"
          :mobile="smAndDown"
          :hide-default-header="smAndDown"
          :headers="memberHeaders"
          :items="members"
          :items-length="safeMemberTotal"
          :loading="resultLoading"
          density="compact"
          hover
          :items-per-page-options="itemsPerPageOptions"
          @update:sort-by="optionsMemberSort"
          @update:items-per-page="optionsMemberPerPage"
        >
          <template #[`item.actions`]="{ item }">
            <v-btn
              data-testid="select-member-btn"
              color="primary"
              density="compact"
              :disabled="disabled || resultLoading"
              @click="selectMember(item)"
            >
              Select
            </v-btn>
          </template>

          <template #[`item.active`]="{ item }">
            <v-chip
              size="small"
              :color="item.active ? 'success' : 'grey'"
              variant="tonal"
            >
              {{ item.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>
        </v-data-table-server>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          density="compact"
          :loading="resultLoading"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useLoadingComponent } from '@/utils/loading';
import { list as listMembers } from '@/service/Setting/member';
import type { IResponseMember } from '@/model/member-interface';
import type { IDefaultParams } from '@/model/utils-interface';
import { actionsResponsive, itemsPerPageOptions } from '@/utils/table-utils';
import { useDisplay } from 'vuetify';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  disabled?: boolean;
}>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', value: IResponseMember): void;
  (e: 'update:loading', value: boolean): void;
}>();

const { smAndDown, mdAndUp } = useDisplay();
const { loading: memberLoading, resultLoading } = useLoadingComponent();

watch(
  resultLoading,
  (val) => {
    emit('update:loading', val);
  },
  { immediate: true }
);

const members = ref<IResponseMember[]>([]);
const memberTotal = ref<number>(0);
const safeMemberTotal = computed(() => Math.max(memberTotal.value || 0, 1));

const memberParams = reactive<IDefaultParams & { active?: string }>({
  search: '',
  order_field: null,
  order_dir: null,
  page: 1,
  per_page: 10,
  active: '',
});

const memberStatusOptions = [
  { title: 'All', value: '' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
];

const memberHeaders = computed(() => [
  actionsResponsive(mdAndUp.value),
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Username', key: 'username', sortable: false },
  { title: 'Status', key: 'active', sortable: false },
]);

const fetchMembers = () => {
  memberLoading.data = true;
  listMembers(memberParams)
    .then(({ data }) => {
      members.value = data.data ?? [];
      memberTotal.value = data.pagination?.total ?? 0;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      memberLoading.data = false;
    });
};

const resetDialogState = () => {
  memberParams.search = '';
  memberParams.order_field = null;
  memberParams.order_dir = null;
  memberParams.page = 1;
  memberParams.per_page = 10;
  memberParams.active = '';
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const refreshMemberPage = () => {
  if (memberParams.page !== 1) memberParams.page = 1;
  else fetchMembers();
};

const optionsMemberPerPage = () => {
  memberParams.page = 1;
  fetchMembers();
};

const optionsMemberSort = (sortBy: Array<{ key: string; order: 'asc' | 'desc' }>) => {
  memberParams.order_field = null;
  memberParams.order_dir = null;

  if (sortBy.length !== 0 && sortBy[0].key === 'name') {
    memberParams.order_field = sortBy[0].key;
    memberParams.order_dir = sortBy[0].order;
  }

  memberParams.page = 1;
  fetchMembers();
};

const selectMember = (item: IResponseMember) => {
  emit('select', item);
  closeDialog();
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      fetchMembers();
    } else {
      resetDialogState();
    }
  }
);

watch(
  () => memberParams.page,
  () => {
    if (!props.modelValue) return;
    fetchMembers();
  }
);
</script>

