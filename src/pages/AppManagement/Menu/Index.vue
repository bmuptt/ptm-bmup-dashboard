<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>

    <v-row
      class="mt-2"
      :dense="true"
    >
      <v-col cols="12">
        <div class="rounded-lg elevation-6 pa-4 ma-2">
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
              permission !== null &&
                permission.update === true &&
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

          <v-btn
            class="mb-2 mr-2 text-capitalize"
            density="compact"
            color="primary"
            :loading="resultLoading"
            @click="statusDialogStructureMenu = true"
          >
            Structure Menu
          </v-btn>

          <v-table
            hover
            density="compact"
            class="mt-2"
            :fixed-header="true"
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
                          v-if="permission?.update"
                          link
                          @click="openDialogForm(element)"
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

    <v-dialog
      v-model="statusDialogForm"
      fullscreen
      persistent
      scrollable
    >
      <dialog-form
        v-if="statusDialogForm"
        :select-data="selectData"
        :permission="permission"
        @close-dialog="closeDialogForm()"
        @refresh-page="fetchData"
      />
    </v-dialog>

    <v-dialog
      v-model="statusDialogAdd"
      width="600"
      persistent
      scrollable
    >
      <dialog-add
        v-if="statusDialogAdd"
        @close-dialog="statusDialogAdd = false"
        @refresh-page="fetchData"
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
        :id="selectData?.id"
        @close-dialog="closeDialogHeader"
        @refresh-page="fetchData"
      />
    </v-dialog>

    <v-dialog
      v-model="statusDialogStructureMenu"
      width="900"
      persistent
      scrollable
    >
      <dialog-structure-menu
        v-if="statusDialogStructureMenu"
        :key="keyStructure"
        :structure-menu="structureMenu"
        @close-dialog="statusDialogStructureMenu = false"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IResPermission } from '@/model/auth-interface';
import { activeMenu, deleteData, list, sort, structure } from '@/service/AppManagement/menu';
import { getPermission } from '@/service/auth';
import { useLoadingComponent } from '@/utils/loading';
import draggable from 'vuedraggable';
import DialogAdd from '@/components/UI/AppManagement/Menu/DialogAddMenu.vue';
import type { IResponseMenu } from '@/model/menu-interface';
import DialogForm from '@/components/UI/AppManagement/Menu/DialogFormMenu.vue';
import { useAttributeDialogConfirm } from '@/utils/attribute-dialog-confirm';
import DialogHeader from '@/components/UI/AppManagement/Menu/DialogFormHeader.vue';
import DialogStructureMenu from '@/components/UI/AppManagement/Menu/DialogStructureMenu.vue';
import { getProfile } from '@/utils/tools';

const swal = inject('$swal') as typeof import('sweetalert2').default;
const route = useRoute();
const permission = ref<IResPermission | null>(null);

// loading
const { loading, resultLoading } = useLoadingComponent();

// table
const items = ref([]);

// dialog
const selectData = ref<IResponseMenu | null>(null);
const statusDialogAdd = ref(false);
const statusDialogForm = ref(false);
const statusDialogHeader = ref(false);
const statusDialogStructureMenu = ref(false);
const keyStructure = ref(1);

// list
const structureMenu = ref([]);

// permission
const fetchPermission = () => {
  loading.permission = true;
  const paramsPermission = {
    key_menu: (route.matched[2]?.name as string) || '',
  };

  getPermission(paramsPermission)
    .then(({ data }) => {
      permission.value = data.data;
    })
    .catch(() => {})
    .finally(() => (loading.permission = false));
};

const fetchStructureMenu = () => {
  loading.structureMenu = true

  structure()
    .then(({ data }) => {
      keyStructure.value++;
      structureMenu.value = data;
    })
    .catch(() => {})
    .finally(() => loading.structureMenu = false);
};

const closeDialogHeader = () => {
  selectData.value = null;
  statusDialogHeader.value = false;
};

const openDialogHeader = (item: IResponseMenu) => {
  selectData.value = item;
  statusDialogHeader.value = true;
};

const closeDialogForm = () => {
  selectData.value = null;
  statusDialogForm.value = false;
};

const openDialogForm = (item = null) => {
  selectData.value = item;
  statusDialogForm.value = true;
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
          fetchData();
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
          fetchData();
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

  sort(0, params)
    .then(({ data }) => {
      swal.fire('Success', data.message, 'success');
      getProfile();
    })
    .catch(() => {})
    .finally(() => {
      loading.submit = false
      fetchData();
    });
};

const fetchData = () => {
  fetchStructureMenu();
  loading.data = true;
  items.value = [];
  list(0)
    .then(({ data }) => {
      items.value = [];
      items.value = data.data;
    })
    .catch(() => {})
    .finally(() => (loading.data = false));
};

fetchPermission();
fetchData();
</script>
