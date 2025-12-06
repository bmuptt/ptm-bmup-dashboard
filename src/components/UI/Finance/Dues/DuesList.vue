<template>
  <v-card
    flat
    class="mt-3"
    elevation="3"
  >
    <v-list
      v-if="items.length > 0"
      lines="two"
    >
      <template
        v-for="(item, index) in items"
        :key="item.member.id"
      >
        <v-list-item data-testid="dues-item">
          <template #prepend>
            <v-avatar
              color="primary"
              size="40"
            >
              <v-img
                v-if="item.member.photo"
                :src="item.member.photo"
                alt="Avatar"
              />
              <span
                v-else
                class="text-white text-h6"
              >{{ getInitials(item.member.name) }}</span>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold">
            {{ item.member.name }}
          </v-list-item-title>

          <!-- Months Checkboxes -->
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div
              v-for="month in item.months"
              :key="month.month"
              class="d-flex flex-column align-center"
              style="width: 48px;"
            >
              <span
                class="text-caption"
                style="font-size: 0.7rem !important;"
              >{{ getMonthName(month.month) }}</span>
              <v-checkbox
                :model-value="month.status === 'paid'"
                density="compact"
                hide-details
                color="primary"
                :disabled="props.canUpdate === false"
                @update:model-value="(val) => onStatusChange(item.member.id, month, val as boolean)"
              />
              <v-btn
                v-if="month.status === 'paid' && month.id !== null && props.canUpdate !== false"
                size="x-small"
                variant="text"
                icon="mdi-file-upload-outline"
                class="mt-1"
                density="compact"
                data-testid="upload-proof-btn"
                @click="openUploadDialog(item.member.name, month)"
              />
            </div>
          </div>
        </v-list-item>
        <v-divider
          v-if="index < items.length - 1"
          inset
        />
      </template>
    </v-list>

    <div
      v-else-if="!resultLoading && items.length === 0"
      class="text-center py-5 text-grey"
    >
      Data membership dues tidak ditemukan.
    </div>

    <div
      v-if="error"
      class="text-center text-error py-2"
    >
      {{ error }}
    </div>

    <!-- Load More -->
    <div
      class="d-flex justify-center py-3"
    >
      <v-progress-circular
        v-if="resultLoading"
        indeterminate
        color="primary"
        size="24"
        data-testid="loading-indicator"
      />
      <v-btn
        v-else-if="hasMore"
        variant="text"
        data-testid="load-more-btn"
        @click="onLoadMoreClick"
      >
        Load More
      </v-btn>
    </div>
  </v-card>

  <ConfirmDialog
    v-model="showDialog"
    v-bind="dialogOptions"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <UploadProofDialog
    v-model="showUploadDialog"
    :data="uploadDialogData"
    @success="onUploadSuccess"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { IMembershipDuesItem, IMembershipDuesMonth, IUploadProofDialogData } from '@/model/finance-interface';
import { getMembershipDues, updateMembershipDues } from '@/service/Finance/membershipDues';
import { useLoadingComponent } from '@/utils/loading';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import UploadProofDialog from '@/components/UI/Finance/Dues/UploadProofDialog.vue';

const props = withDefaults(defineProps<{
  search?: string;
  periodYear: number;
  canUpdate?: boolean;
}>(), {
  search: undefined,
  canUpdate: true,
});

const items = ref<IMembershipDuesItem[]>([]);
const currentPage = ref<number>(1);
const hasMore = ref<boolean>(false);
const error = ref<string | null>(null);
const limit = 10;

const showUploadDialog = ref<boolean>(false);
const uploadDialogData = ref<IUploadProofDialogData | null>(null);

const { loading, resultLoading } = useLoadingComponent();
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthName(month: number) {
  return monthNames[month - 1] || month;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

async function onStatusChange(memberId: number, month: IMembershipDuesMonth, newValue: boolean) {
  const newStatus = newValue ? 'paid' : 'unpaid';
  
  const confirmed = await showConfirm({
    title: 'Konfirmasi Perubahan Status',
    html: `Apakah Anda yakin ingin mengubah status iuran bulan <b>${getMonthName(month.month)}</b> menjadi <b>${newStatus}</b>?`,
    icon: 'question',
    confirmButtonText: 'Ya, Ubah',
    confirmButtonColor: 'primary',
  });

  if (confirmed) {
    try {
      await updateMembershipDues({
        member_id: memberId,
        period_year: props.periodYear,
        period_month: month.month,
        status: newStatus,
      });
      
      // Update UI state directly
      month.status = newStatus;
    } catch (err) {
      console.error(err);
      // Optionally show error message to user
    }
  }
}

function openUploadDialog(memberName: string, month: IMembershipDuesMonth) {
  if (month.id === null) return;
  uploadDialogData.value = {
    membership_dues_id: month.id,
    member_name: memberName,
    month: month.month,
    period_year: props.periodYear,
    current_status: month.status,
  };
  showUploadDialog.value = true;
}

function onUploadSuccess() {
  // Refresh current page to reflect potential proof changes
  fetchPage(1, true);
}

function fetchPage(page = 1, reset = false) {
  loading.data = true;
  error.value = null;

  if (reset) {
    items.value = [];
    currentPage.value = 1;
    hasMore.value = false;
  }

  getMembershipDues({
    limit,
    page,
    period_year: props.periodYear,
    search: props.search,
  })
    .then(({ data }) => {
      const responseData = data;
      
      if (reset) {
        items.value = responseData.items;
      } else {
        items.value = [...items.value, ...responseData.items];
      }
      
      if (responseData.pagination) {
        currentPage.value = responseData.pagination.currentPage;
        hasMore.value = responseData.pagination.currentPage < responseData.pagination.totalPages;
      } else {
         // Fallback if pagination is missing but maybe meta has something, or just disable load more
         hasMore.value = false;
      }
    })
    .catch((err) => {
      console.error(err);
      error.value = 'Gagal memuat data membership dues';
    })
    .finally(() => {
      loading.data = false;
    });
}

function onLoadMoreClick() {
  if (hasMore.value) {
    fetchPage(currentPage.value + 1);
  }
}

watch(
  () => [props.search, props.periodYear],
  () => {
    fetchPage(1, true);
  },
  { immediate: false }
);

onMounted(() => {
  fetchPage(1, true);
});

defineExpose({
    fetchPage
});
</script>

<style scoped>
.gap-2 { gap: 8px; }
</style>
