<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-row class="d-flex align-center">
        <v-col cols="6">
          <div class="font-24 font-weight-bold">
            Form
            {{ route.matched[2].meta ? route.matched[2].meta.label : '' }}
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

      <v-row
        v-if="itemNested.length"
        class="mt-4"
        :dense="true"
      >
        <v-col
          cols="12"
          class="d-flex align-center"
        >
          <template
            v-for="(itemBC, indexBC) in itemNested"
            :key="indexBC"
          >
            <v-btn
              variant="text"
              :color="itemNested.length - 1 === indexBC ? 'grey' : 'primary'"
              class="mr-2"
              :readonly="itemNested.length - 1 === indexBC"
              @click="fetchForm(itemBC, indexBC)"
            >
              {{ itemBC.name }}
            </v-btn>
            <v-icon
              v-if="itemNested.length - 1 !== indexBC"
              icon="mdi-chevron-right"
            />
          </template>
        </v-col>

        <v-col
          v-if="itemNested.length > 1"
          cols="12"
        >
          <v-btn
            density="compact"
            :loading="resultLoading"
            variant="text"
            type="button"
            color="primary"
            prepend-icon="mdi-chevron-left"
            @click="
              fetchForm(
                itemNested[itemNested.length - 2],
                itemNested.length - 2
              )
            "
          >
            Back
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col
          cols="12"
          md="6"
        >
          <div
            v-if="selectData !== null"
            class="elevation-3 rounded-lg pa-4"
          >
            <form-data
              v-if="selectData !== null"
              :key="formKey"
              :select-data="itemSelectData"
              @refresh-page="moduleRefreshPage"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="elevation-3 rounded-lg pa-4">
            <p class="font-16 font-weight-bold mb-2">
              Sub Menu
            </p>

            <v-btn
              v-if="permission !== null && permission.create === true"
              class="mb-2 mr-2 text-capitalize"
              density="compact"
              color="primary"
              :loading="resultLoading"
              @click="statusDialogAdd = true"
            >
              Add
            </v-btn>

            <v-btn
              v-if="
                items.length >= 2
              "
              class="mb-2 mr-2 text-capitalize"
              density="compact"
              color="primary"
              :loading="resultLoading"
              @click="updateSort"
            >
              Update Sort
            </v-btn>

            <v-table
              hover
              density="compact"
              class="mt-2"
            >
              <thead>
                <tr>
                  <th />
                  <th>Actions</th>
                  <th>Key Menu</th>
                  <th style="min-width: 200px">
                    Name
                  </th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Count Submenu</th>
                </tr>
              </thead>
              <tbody v-if="resultLoading">
                <tr>
                  <td
                    colspan="5"
                    align="center"
                  >
                    Loading...
                  </td>
                </tr>
              </tbody>
              <tbody v-if="!resultLoading && items.length === 0">
                <tr>
                  <td
                    colspan="5"
                    align="center"
                  >
                    No Data
                  </td>
                </tr>
              </tbody>
              <draggable
                v-if="!resultLoading"
                v-model="items"
                tag="tbody"
                item-key="id"
              >
                <template #item="{ element }">
                  <tr class="cursor-pointer">
                    <td>
                      <v-icon
                        class="mr-2"
                        icon="mdi-drag-horizontal-variant"
                      />
                    </td>
                    <td>
                      <v-menu v-if="permission?.update || permission?.delete">
                        <template #activator="{ props: propsBtn }">
                          <v-btn
                            density="compact"
                            :loading="resultLoading"
                            v-bind="propsBtn"
                          >
                            Action
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-if="permission?.update"
                            link
                            @click="fetchForm(element)"
                          >
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-if="permission?.delete && element.active === 'Active'"
                            link
                            @click="submitDelete(element.id)"
                          >
                            <v-list-item-title>Inactive</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-if="element.active === 'Inactive'"
                            link
                            @click="submitActive(element.id)"
                          >
                            <v-list-item-title>Active</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-if="permission?.update"
                            link
                            @click="openDialogHeader(element)"
                          >
                            <v-list-item-title>Change Parent</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </td>
                    <td>{{ element.key_menu }}</td>
                    <td>{{ element.name }}</td>
                    <td>{{ element.url }}</td>
                    <td>{{ element.active }}</td>
                    <td align="center">
                      {{ element.children.length }}
                    </td>
                  </tr>
                </template>
              </draggable>
            </v-table>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="statusDialogAdd"
      width="600"
      persistent
      scrollable
    >
      <dialog-add
        v-if="statusDialogAdd"
        :select-data="itemSelectData"
        @close-dialog="statusDialogAdd = false"
        @refresh-page="moduleRefreshPage"
      />
    </v-dialog>

    <v-dialog
      v-model="statusDialogHeader"
      width="900"
      persistent
      scrollable
    >
      <dialog-header
        v-if="statusDialogHeader"
        :id="itemSelectHeader?.id"
        @close-dialog="closeDialogHeader"
        @refresh-page="moduleRefreshPage"
      />
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import type { IResponseMenu } from '@/model/menu-interface';
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import FormData from './FormDataMenu.vue';
import { activeMenu, deleteData, list, sort } from '@/service/AppManagement/menu';
import draggable from 'vuedraggable';
import DialogAdd from './DialogAddMenu.vue';
import { useAttributeDialogConfirm } from '@/utils/attribute-dialog-confirm';
import DialogHeader from './DialogFormHeader.vue';
import { getProfile } from '@/utils/tools';

const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;

// props
const props = defineProps(propsForm<IResponseMenu>());
const emit = defineEmits(emitsGlobal);

// loading
const { loading, resultLoading } = useLoadingForm();

// table
const items = ref([]);

// dialog
const statusDialogAdd = ref(false);
const statusDialogHeader = ref(false);
const itemSelectHeader = ref<IResponseMenu | null>(null);

// data
const formKey = ref(0);
const itemNested = ref<IResponseMenu[]>([]);
const itemSelectData = ref<IResponseMenu | null>(null);

const moduleRefreshPage = () => {
  emit('refreshPage');
  emit('closeDialog');
};

const closeDialogHeader = () => {
  itemSelectHeader.value = null;
  statusDialogHeader.value = false;
};

const openDialogHeader = (item: IResponseMenu) => {
  itemSelectHeader.value = item;
  statusDialogHeader.value = true;
};

const submitActive = (id: number) => {
  const data = {
    title: 'Active Menu',
    html: `Are you sure you want to active this data?`,
    confirmButtonText: 'Yes',
  };

  swal.fire(useAttributeDialogConfirm(data)).then((result) => {
    if (result.isConfirmed) {
      loading.submit = true;

      activeMenu(id)
        .then(({ data }) => {
          swal.fire('Success', data.message, 'success');
          moduleRefreshPage();
        })
        .catch(() => {})
        .finally(() => (loading.submit = false));
    }
  });
};

const submitDelete = (id: number) => {
  const data = {
    title: 'Delete Data',
    html: `Are you sure you want to delete this data?`,
    confirmButtonText: 'Yes',
  };

  swal.fire(useAttributeDialogConfirm(data)).then((result) => {
    if (result.isConfirmed) {
      loading.submit = true;

      deleteData(id)
        .then(({ data }) => {
          swal.fire('Success', data.message, 'success');
          return getProfile();
        })
        .then(() => {
          moduleRefreshPage();
        })
        .catch(() => {})
        .finally(() => (loading.submit = false));
    }
  });
};

const updateSort = () => {
  loading.submit = true;
  const params = {
    list_menu: items.value,
  };

  if (itemSelectData.value) {
    sort(itemSelectData.value.id, params)
      .then(({ data }) => {
        swal.fire('Success', data.message, 'success');
        getProfile();
      })
      .catch(() => {})
      .finally(() => {
        loading.submit = false;
        if (itemSelectData.value) fetchData(itemSelectData.value.id);
      });
  }

};

const fetchData = (id: number) => {
  loading.data = true;
  items.value = [];
  list(id)
    .then(({ data }) => {
      items.value = [];
      items.value = data.data;
    })
    .catch(() => {})
    .finally(() => (loading.data = false));
};

const fetchForm = (item: IResponseMenu, indexBC: number | null = null) => {
  if (indexBC === null) {
    itemNested.value = [...itemNested.value, item];
  } else {
    if (indexBC >= 0 && indexBC < itemNested.value.length - 1) {
      itemNested.value.splice(indexBC + 1, itemNested.value.length - indexBC);
    }
  }

  itemSelectData.value = item;
  formKey.value++;
  fetchData(item.id);
};

if (props.selectData) {
  fetchForm(props.selectData);
}
</script>