<template>
  <v-card elevation="3">
    <v-card-title class="text-h6">
      History Balance
    </v-card-title>
    <v-divider />

    <v-card-text>
      <div
        v-if="error"
        class="text-error mb-3"
      >
        {{ error }}
      </div>

      <v-progress-linear
        v-if="resultLoading"
        indeterminate
        color="primary"
        class="mb-2"
      />

      <v-list density="compact">
        <template v-if="items.length">
          <v-list-item
            v-for="(item, idx) in items"
            :key="item.id + '-' + idx"
            class="py-2"
          >
            <v-list-item-title class="d-flex flex-wrap align-center justify-space-between">
              <div class="text-caption">
                {{ formatDate(item.created_at) }}
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <div class="d-flex flex-wrap gap-3">
                <span>Status: {{ item.status ? 'Debit' : 'Credit' }}</span>
                <span>Value: {{ item.value }}</span>
                <span>By: {{ item.created_by_user?.name }}</span>
              </div>
              <div class="text-caption mt-1">
                {{ item.description }}
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
        <template v-else>
          <div class="text-caption py-4">
            Tidak ada data history.
          </div>
        </template>
      </v-list>

      <div
        ref="loadMoreRef"
        style="height: 1px"
      />

      <div class="d-flex justify-center mt-2">
        <v-btn
          v-if="hasMore && !resultLoading"
          size="small"
          variant="tonal"
          color="primary"
          @click="onLoadMoreClick"
        >
          Load More
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ICashBalanceHistoryItem } from '@/model/finance-interface';
import { getCashBalanceHistory } from '@/service/Finance/cashBalance';
import { useLoadingComponent } from '@/utils/loading';

const items = ref<ICashBalanceHistoryItem[]>([]);
const nextCursor = ref<number | null>(null);
const hasMore = ref<boolean>(false);
const error = ref<string | null>(null);
const loadMoreRef = ref<HTMLDivElement | null>(null);
const limit = 10;

const { loading, resultLoading } = useLoadingComponent();

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function sortDescByCreatedAt(list: ICashBalanceHistoryItem[]) {
  return [...list].sort((a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
}

function fetchPage(cursor?: number) {
  loading.data = true;
  error.value = null;

  getCashBalanceHistory({ limit, cursor })
    .then(({ data }) => {
      const payload = data.data;
      const merged = [...items.value, ...payload.items];
      items.value = sortDescByCreatedAt(merged);
      nextCursor.value = payload.next_cursor ?? null;
      hasMore.value = payload.has_more;
    })
    .catch((err) => {
      console.error(err);
      error.value = 'Gagal memuat history';
    })
    .finally(() => {
      loading.data = false;
    });
}

function initObserver() {
  if (!loadMoreRef.value) return;
  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore.value && !loading.data) {
        fetchPage(nextCursor.value ?? undefined);
      }
    });
  });

  observer.observe(loadMoreRef.value);
}

function onLoadMoreClick() {
  if (hasMore.value) {
    fetchPage(nextCursor.value ?? undefined);
  }
}

onMounted(() => {
  fetchPage();
  initObserver();
});

defineExpose({
  fetchPage,
  onLoadMoreClick,
  items,
  hasMore,
});
</script>

<style scoped>
.gap-3 { gap: 12px; }
</style>
