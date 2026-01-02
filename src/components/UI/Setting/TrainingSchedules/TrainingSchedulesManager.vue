<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row class="d-flex align-center">
            <v-col cols="12">
              <div class="d-flex flex-wrap align-center ga-2">
                <v-btn
                  v-if="permission?.create"
                  data-testid="add-training-schedule-btn"
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
                  v-if="permission?.update && items.length >= 2"
                  data-testid="update-sort-training-schedule-btn"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="submitSort"
                >
                  Update Sort
                </v-btn>

                <v-btn
                  data-testid="refresh-training-schedule-btn"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="fetchSchedules"
                >
                  Refresh
                </v-btn>

                <v-spacer />

                <v-select
                  v-model="publishedFilter"
                  density="compact"
                  variant="outlined"
                  label="Published"
                  :items="publishedOptions"
                  item-title="title"
                  item-value="value"
                  hide-details
                  style="max-width: 240px"
                  :disabled="resultLoading"
                  data-testid="published-filter"
                  @update:model-value="fetchSchedules"
                />
              </div>
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

            <draggable
              v-else
              v-model="items"
              tag="div"
              item-key="id"
              class="mt-2 d-flex flex-column ga-2"
            >
              <template #item="{ element }">
                <v-card
                  variant="outlined"
                  class="pa-3"
                >
                  <div class="d-flex align-start justify-space-between ga-2">
                    <div
                      class="d-flex align-start ga-2 flex-grow-1"
                      style="min-width: 0"
                    >
                      <v-icon
                        icon="mdi-drag-horizontal-variant"
                        class="mt-1"
                      />

                      <div style="min-width: 0">
                        <div class="font-weight-medium">
                          {{ dayOfWeekLabel(element.day_of_week) }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ element.start_time }} - {{ element.end_time }}
                        </div>
                        <div
                          class="text-body-2 mt-1"
                          style="white-space: pre-line"
                        >
                          {{ element.category }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                          Pelatih: {{ element.member?.name || '-' }}
                        </div>
                      </div>
                    </div>

                    <v-menu v-if="permission?.update || permission?.delete">
                      <template #activator="{ props: menuProps }">
                        <v-btn
                          data-testid="training-schedule-action-btn"
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

                  <div class="d-flex align-center justify-space-between ga-2 mt-3">
                    <div class="text-caption text-medium-emphasis">
                      Sort: {{ element.display_order ?? '-' }}
                    </div>
                    <v-chip
                      size="small"
                      :color="element.is_published ? 'success' : 'grey'"
                      variant="tonal"
                    >
                      {{ element.is_published ? 'Yes' : 'No' }}
                    </v-chip>
                  </div>
                </v-card>
              </template>
            </draggable>
          </div>

          <v-table
            v-else
            hover
            density="compact"
            class="mt-2"
            :fixed-header="true"
          >
            <thead>
              <tr>
                <th style="width: 44px" />
                <th style="width: 120px">
                  Actions
                </th>
                <th style="width: 160px">
                  Day
                </th>
                <th style="width: 160px">
                  Time
                </th>
                <th style="min-width: 260px">
                  Category
                </th>
                <th style="min-width: 240px">
                  Pelatih
                </th>
                <th style="width: 120px">
                  Published
                </th>
                <th style="width: 90px">
                  Sort
                </th>
              </tr>
            </thead>

            <tbody v-if="resultLoading">
              <tr>
                <td
                  colspan="8"
                  align="center"
                >
                  Loading...
                </td>
              </tr>
            </tbody>

            <tbody v-else-if="items.length === 0">
              <tr>
                <td
                  colspan="8"
                  align="center"
                >
                  No Data
                </td>
              </tr>
            </tbody>

            <draggable
              v-else
              v-model="items"
              tag="tbody"
              item-key="id"
            >
              <template #item="{ element }">
                <tr>
                  <td>
                    <v-icon
                      class="mr-2"
                      icon="mdi-drag-horizontal-variant"
                    />
                  </td>

                  <td>
                    <v-menu v-if="permission?.update || permission?.delete">
                      <template #activator="{ props: menuProps }">
                        <v-btn
                          data-testid="training-schedule-action-btn"
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
                  </td>

                  <td>
                    {{ dayOfWeekLabel(element.day_of_week) }}
                  </td>

                  <td>
                    {{ element.start_time }} - {{ element.end_time }}
                  </td>

                  <td>
                    <div style="white-space: pre-line">
                      {{ element.category }}
                    </div>
                  </td>

                  <td>
                    {{ element.member?.name || '-' }}
                  </td>

                  <td>
                    <v-chip
                      size="small"
                      :color="element.is_published ? 'success' : 'grey'"
                      variant="tonal"
                    >
                      {{ element.is_published ? 'Yes' : 'No' }}
                    </v-chip>
                  </td>

                  <td>
                    {{ element.display_order ?? '-' }}
                  </td>
                </tr>
              </template>
            </draggable>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="statusDialogForm"
      width="860"
      persistent
      scrollable
    >
      <DialogFormTrainingSchedule
        v-if="statusDialogForm"
        :select-data="selectData"
        @close-dialog="closeDialogForm"
        @refresh-page="fetchSchedules"
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
import draggable from 'vuedraggable';
import type { IResPermission } from '@/model/auth-interface';
import type { ITrainingSchedule } from '@/model/training-schedule-interface';
import { deleteTrainingSchedule, listTrainingSchedules, sortTrainingSchedules } from '@/service/Setting/trainingSchedules';
import { useLoadingComponent } from '@/utils/loading';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import DialogFormTrainingSchedule from '@/components/UI/Setting/TrainingSchedules/DialogFormTrainingSchedule.vue';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;

defineProps<{
  permission: IResPermission | null;
}>();

const { smAndDown } = useDisplay();
const { loading, resultLoading } = useLoadingComponent();
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

const items = ref<ITrainingSchedule[]>([]);

const publishedFilter = ref<'' | 'true' | 'false'>('');
const publishedOptions = [
  { title: 'All', value: '' },
  { title: 'Published', value: 'true' },
  { title: 'Unpublished', value: 'false' },
];

const selectData = ref<ITrainingSchedule | null>(null);
const statusDialogForm = ref(false);

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: ITrainingSchedule | null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const dayOfWeekLabel = (day: number) => {
  const map: Record<number, string> = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
    7: 'Minggu',
  };
  return map[day] || String(day);
};

const fetchSchedules = () => {
  loading.data = true;

  const params =
    publishedFilter.value === ''
      ? undefined
      : {
          is_published: publishedFilter.value === 'true',
        };

  listTrainingSchedules(params)
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

const submitSort = () => {
  loading.submit = true;
  const ids = items.value.map((item) => String(item.id));
  sortTrainingSchedules({ ids })
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Sort berhasil disimpan', 'success');
      fetchSchedules();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.submit = false;
    });
};

const confirmDelete = (id: number) => {
  showConfirm({
    title: 'Konfirmasi',
    html: 'Yakin ingin menghapus jadwal ini?',
    confirmButtonText: 'Delete',
    icon: 'warning',
  }).then((confirmed) => {
    if (!confirmed) return;
    loading.submit = true;
    deleteTrainingSchedule(id)
      .then(({ data }) => {
        swal.fire('Success', data.message || 'Data berhasil dihapus', 'success');
        fetchSchedules();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        loading.submit = false;
      });
  });
};

fetchSchedules();
</script>

