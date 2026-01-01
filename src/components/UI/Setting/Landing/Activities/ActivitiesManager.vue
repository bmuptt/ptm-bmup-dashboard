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
                  data-testid="add-activity-btn"
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
                  data-testid="update-sort-activity-btn"
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
                  data-testid="refresh-activity-btn"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="fetchActivities"
                >
                  Refresh
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-data-table
            v-if="smAndDown"
            class="mt-2"
            :headers="headersMobile"
            :items="items"
            item-value="id"
            density="compact"
            hover
            no-data-text="No Data"
            :loading="resultLoading"
            :mobile="smAndDown"
            :hide-default-header="smAndDown"
            hide-default-footer
          >
            <template #[`item.actions`]="{ item }">
              <v-menu v-if="permission?.update || permission?.delete">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    data-testid="activity-action-btn"
                    density="compact"
                    :loading="resultLoading"
                    v-bind="menuProps"
                  >
                    Action
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-if="permission?.update"
                    link
                    @click="openDialogForm(getRawActivity(item))"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="permission?.delete"
                    link
                    @click="confirmDelete(getRawActivity(item).id)"
                  >
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>

            <template #[`item.icon`]="{ item }">
              <div class="d-flex align-center ga-2">
                <v-icon :icon="getRawActivity(item).icon?.name || 'mdi-help-circle-outline'" />
                <div>
                  <div class="font-weight-medium">
                    {{ getRawActivity(item).icon?.label || '-' }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ getRawActivity(item).icon?.name || '-' }}
                  </div>
                </div>
              </div>
            </template>

            <template #[`item.is_published`]="{ item }">
              <v-chip
                size="small"
                :color="getRawActivity(item).is_published ? 'success' : 'grey'"
                variant="tonal"
              >
                {{ getRawActivity(item).is_published ? 'Yes' : 'No' }}
              </v-chip>
            </template>
          </v-data-table>

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
                <th style="width: 220px">
                  Icon
                </th>
                <th style="min-width: 220px">
                  Title
                </th>
                <th style="min-width: 340px">
                  Subtitle
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
                  colspan="7"
                  align="center"
                >
                  Loading...
                </td>
              </tr>
            </tbody>

            <tbody v-else-if="items.length === 0">
              <tr>
                <td
                  colspan="7"
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
                          data-testid="activity-action-btn"
                          density="compact"
                          :loading="resultLoading"
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
                    <div class="d-flex align-center ga-2">
                      <v-icon :icon="element.icon?.name || 'mdi-help-circle-outline'" />
                      <div>
                        <div class="font-weight-medium">
                          {{ element.icon?.label || '-' }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ element.icon?.name || '-' }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ element.title }}
                  </td>

                  <td
                    class="text-truncate"
                    style="max-width: 520px"
                  >
                    {{ element.subtitle }}
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
                    {{ element.sort_order ?? '-' }}
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
      width="720"
      persistent
      scrollable
    >
      <DialogFormActivity
        v-if="statusDialogForm"
        :select-data="selectData"
        :icons="icons"
        @close-dialog="closeDialogForm"
        @refresh-page="fetchActivities"
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
import type { ILandingActivity, ILandingIcon } from '@/model/landing-activity-interface';
import { deleteLandingActivity, listLandingActivities, sortLandingActivities } from '@/service/Setting/landingActivities';
import { listLandingIcons } from '@/service/Setting/landingIcons';
import { useLoadingComponent } from '@/utils/loading';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import DialogFormActivity from '@/components/UI/Setting/Landing/Activities/DialogFormActivity.vue';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;

defineProps<{
  permission: IResPermission | null;
}>();

const { smAndDown } = useDisplay();

const { loading, resultLoading } = useLoadingComponent();
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

const items = ref<ILandingActivity[]>([]);
const icons = ref<ILandingIcon[]>([]);

const headersMobile = [
  { title: 'Actions', key: 'actions', sortable: false, width: 120 },
  { title: 'Icon', key: 'icon', sortable: false, width: 220 },
  { title: 'Title', key: 'title', sortable: false, minWidth: 220 },
  { title: 'Subtitle', key: 'subtitle', sortable: false, minWidth: 340 },
  { title: 'Published', key: 'is_published', sortable: false, width: 120 },
];

const selectData = ref<ILandingActivity | null>(null);
const statusDialogForm = ref(false);

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: ILandingActivity | null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const getRawActivity = (item: unknown): ILandingActivity => {
  const maybeWrapped = item as { raw?: ILandingActivity };
  return maybeWrapped.raw ?? (item as ILandingActivity);
};

const fetchIcons = () => {
  loading.role = true;
  listLandingIcons()
    .then(({ data }) => {
      icons.value = data.data ?? [];
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.role = false;
    });
};

const fetchActivities = () => {
  loading.data = true;
  listLandingActivities()
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
  sortLandingActivities({ ids })
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Sort berhasil disimpan', 'success');
      fetchActivities();
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
    title: 'Hapus Activity',
    html: 'Yakin ingin menghapus activity ini?',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d32f2f',
    icon: 'warning',
  })
    .then((confirmed) => {
      if (!confirmed) return;
      loading.submit = true;
      deleteLandingActivity(id)
        .then(({ data }) => {
          swal.fire('Success', data.message || 'Activity berhasil dihapus', 'success');
          fetchActivities();
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
  fetchIcons();
  fetchActivities();
});
</script>
