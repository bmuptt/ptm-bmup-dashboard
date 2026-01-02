<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row class="d-flex align-center">
            <v-col cols="12">
              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  v-if="permission?.create"
                  data-testid="add-about-timeline-btn"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="openDialogForm(null)"
                >
                  Add
                </v-btn>

                <v-btn
                  data-testid="refresh-about-timeline-btn"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="fetchTimelines"
                >
                  Refresh
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="publishedFilter"
                data-testid="published-filter"
                density="compact"
                variant="outlined"
                label="Filter Published"
                :items="publishedOptions"
                item-title="title"
                item-value="value"
                hide-details
                :disabled="resultLoading"
                @update:model-value="fetchTimelines"
              />
            </v-col>
          </v-row>

          <div v-if="smAndDown">
            <div
              v-if="resultLoading"
              class="mt-2"
            >
              <v-card
                class="pa-4"
                variant="outlined"
              >
                Loading...
              </v-card>
            </div>

            <div
              v-else-if="items.length === 0"
              class="mt-2"
            >
              <v-card
                class="pa-4"
                variant="outlined"
              >
                No Data
              </v-card>
            </div>

            <div
              v-else
              class="mt-2 d-flex flex-column ga-2"
            >
              <v-card
                v-for="element in items"
                :key="element.id"
                variant="outlined"
                class="pa-3"
              >
                <div class="d-flex align-start justify-space-between ga-2">
                  <div style="min-width: 0">
                    <div class="text-caption text-medium-emphasis">
                      Year: {{ element.year ?? '-' }}
                    </div>
                    <div
                      class="font-weight-medium"
                      style="white-space: pre-line"
                    >
                      {{ element.title || '-' }}
                    </div>
                  </div>

                  <v-menu v-if="permission?.update || permission?.delete">
                    <template #activator="{ props: menuProps }">
                      <v-btn
                        data-testid="about-timeline-action-btn"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-vertical"
                        :loading="resultLoading"
                        :disabled="resultLoading"
                        v-bind="menuProps"
                      />
                    </template>

                    <v-list>
                      <v-list-item
                        v-if="permission?.update"
                        link
                        @click="openDialogForm(element)"
                      >
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="permission?.delete"
                        link
                        @click="confirmDelete(element.id)"
                      >
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <div class="mt-3 d-flex align-center justify-space-between ga-2">
                  <v-chip
                    size="small"
                    :color="element.is_published ? 'success' : 'grey'"
                    variant="tonal"
                  >
                    {{ element.is_published ? 'Yes' : 'No' }}
                  </v-chip>
                </div>
              </v-card>
            </div>
          </div>

          <v-data-table
            v-else
            class="mt-2"
            :headers="headers"
            :items="items"
            item-value="id"
            density="compact"
            hover
            no-data-text="No Data"
            :loading="resultLoading"
            hide-default-footer
          >
            <template #[`item.actions`]="{ item }">
              <v-menu v-if="permission?.update || permission?.delete">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    data-testid="about-timeline-action-btn"
                    density="compact"
                    :loading="resultLoading"
                    :disabled="resultLoading"
                    v-bind="menuProps"
                  >
                    Action
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-if="permission?.update"
                    link
                    @click="openDialogForm(getRawTimeline(item))"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="permission?.delete"
                    link
                    @click="confirmDelete(getRawTimeline(item).id)"
                  >
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>

            <template #[`item.title`]="{ item }">
              <div style="white-space: pre-line">
                {{ getRawTimeline(item).title || '-' }}
              </div>
            </template>

            <template #[`item.is_published`]="{ item }">
              <v-chip
                size="small"
                :color="getRawTimeline(item).is_published ? 'success' : 'grey'"
                variant="tonal"
              >
                {{ getRawTimeline(item).is_published ? 'Yes' : 'No' }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="statusDialogForm"
      width="720"
      persistent
      scrollable
    >
      <DialogFormAboutTimeline
        v-if="statusDialogForm"
        :select-data="selectData"
        @close-dialog="closeDialogForm"
        @refresh-page="fetchTimelines"
      />
    </v-dialog>

    <ConfirmDialog
      v-model="showDialog"
      v-bind="dialogOptions"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IResPermission } from '@/model/auth-interface';
import type { IAboutTimeline } from '@/model/about-timeline-interface';
import { deleteAboutTimeline, listAboutTimelines } from '@/service/Setting/aboutTimelines';
import { useLoadingComponent } from '@/utils/loading';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import DialogFormAboutTimeline from '@/components/UI/Setting/Landing/AboutTimelines/DialogFormAboutTimeline.vue';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;

const { smAndDown } = useDisplay();

defineProps<{
  permission: IResPermission | null;
}>();

const { loading, resultLoading } = useLoadingComponent();
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

const items = ref<IAboutTimeline[]>([]);

const headers = [
  { title: 'Actions', key: 'actions', sortable: false, width: 120 },
  { title: 'Year', key: 'year', sortable: true, width: 120 },
  { title: 'Title', key: 'title', sortable: false },
  { title: 'Published', key: 'is_published', sortable: false, width: 140 },
];

const publishedFilter = ref<'' | 'true' | 'false'>('');
const publishedOptions = [
  { title: 'All', value: '' },
  { title: 'Published', value: 'true' },
  { title: 'Unpublished', value: 'false' },
];

const selectData = ref<IAboutTimeline | null>(null);
const statusDialogForm = ref(false);

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: IAboutTimeline | null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const getRawTimeline = (item: unknown): IAboutTimeline => {
  const maybeWrapped = item as { raw?: IAboutTimeline };
  return maybeWrapped.raw ?? (item as IAboutTimeline);
};

const fetchTimelines = () => {
  loading.data = true;

  const params =
    publishedFilter.value === ''
      ? undefined
      : {
          is_published: publishedFilter.value === 'true',
        };

  listAboutTimelines(params)
    .then(({ data }) => {
      items.value = data.data ?? [];
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.data = false;
    });
};

const confirmDelete = (id: number) => {
  showConfirm({
    title: 'Hapus Timeline',
    html: 'Yakin ingin menghapus timeline ini?',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d32f2f',
    icon: 'warning',
  })
    .then((confirmed) => {
      if (!confirmed) return;
      loading.submit = true;
      deleteAboutTimeline(id)
        .then(({ data }) => {
          swal.fire('Success', data.message || 'Timeline berhasil dihapus', 'success');
          fetchTimelines();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          loading.submit = false;
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(() => {
  fetchTimelines();
});

defineExpose({
  confirmDelete,
  fetchTimelines,
  publishedFilter,
});
</script>
