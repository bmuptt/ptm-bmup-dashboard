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
                  data-testid="add-gallery-item-btn"
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
                  data-testid="update-sort-gallery-item-btn"
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
                  data-testid="refresh-gallery-item-btn"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="resultLoading"
                  @click="fetchGalleryItems"
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
                  @update:model-value="fetchGalleryItems"
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

                      <div
                        class="font-weight-medium"
                        style="min-width: 0"
                      >
                        {{ element.title }}
                      </div>
                    </div>

                    <v-menu v-if="permission?.update || permission?.delete">
                      <template #activator="{ props: menuProps }">
                        <v-btn
                          data-testid="gallery-item-action-btn"
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

                  <div
                    v-if="element.image_url"
                    class="mt-2"
                    data-testid="gallery-item-mobile-image"
                  >
                    <v-img
                      :src="element.image_url"
                      :aspect-ratio="574 / 383"
                      cover
                      class="rounded"
                    />
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
                <th style="min-width: 220px">
                  Title
                </th>
                <th style="min-width: 240px">
                  Image
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
                  colspan="6"
                  align="center"
                >
                  Loading...
                </td>
              </tr>
            </tbody>

            <tbody v-else-if="items.length === 0">
              <tr>
                <td
                  colspan="6"
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
                          data-testid="gallery-item-action-btn"
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
                    {{ element.title }}
                  </td>

                  <td class="py-2">
                    <div style="max-width: 280px">
                      <v-img
                        v-if="element.image_url"
                        :src="element.image_url"
                        :aspect-ratio="574 / 383"
                        height="90"
                        cover
                        class="rounded"
                      />
                    </div>
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
      <DialogFormGalleryItem
        v-if="statusDialogForm"
        :select-data="selectData"
        @close-dialog="closeDialogForm"
        @refresh-page="fetchGalleryItems"
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
import type { IGalleryItem } from '@/model/gallery-item-interface';
import { deleteGalleryItem, listGalleryItems, sortGalleryItems } from '@/service/Setting/galleryItems';
import { useLoadingComponent } from '@/utils/loading';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import DialogFormGalleryItem from '@/components/UI/Setting/GalleryItems/DialogFormGalleryItem.vue';
import { useDisplay } from 'vuetify';

const swal = inject('$swal') as typeof import('sweetalert2').default;

defineProps<{
  permission: IResPermission | null;
}>();

const { smAndDown } = useDisplay();
const { loading, resultLoading } = useLoadingComponent();
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

const items = ref<IGalleryItem[]>([]);

const publishedFilter = ref<'' | 'true' | 'false'>('');
const publishedOptions = [
  { title: 'All', value: '' },
  { title: 'Published', value: 'true' },
  { title: 'Unpublished', value: 'false' },
];

const selectData = ref<IGalleryItem | null>(null);
const statusDialogForm = ref(false);

const closeDialogForm = () => {
  statusDialogForm.value = false;
};

const openDialogForm = (data: IGalleryItem | null) => {
  selectData.value = data;
  statusDialogForm.value = true;
};

const fetchGalleryItems = () => {
  loading.data = true;

  const params =
    publishedFilter.value === ''
      ? undefined
      : {
          is_published: publishedFilter.value === 'true',
        };

  listGalleryItems(params)
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
  sortGalleryItems({ ids })
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Sort berhasil disimpan', 'success');
      fetchGalleryItems();
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
    title: 'Hapus Galeri',
    html: 'Yakin ingin menghapus item galeri ini?',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d32f2f',
    icon: 'warning',
  })
    .then((confirmed) => {
      if (!confirmed) return;
      loading.submit = true;
      deleteGalleryItem(id)
        .then(({ data }) => {
          swal.fire('Success', data.message || 'Data berhasil dihapus', 'success');
          fetchGalleryItems();
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
  fetchGalleryItems();
});

defineExpose({
  confirmDelete,
  fetchGalleryItems,
  publishedFilter,
  submitSort,
});
</script>
