<template>
  <v-card>
    <div class="pa-6 bg-white">
      <v-form @submit.prevent="submitForm">
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
              variant="outlined"
              color="primary"
              class="mr-2 mb-2"
              :loading="resultLoading"
              @click="$emit('closeDialog')"
            >
              Cancel
            </v-btn>
    
            <v-btn
              type="submit"
              color="primary"
              class="mr-2 mb-2"
              :loading="resultLoading"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>

        <v-row
          v-if="state !== null && state.length > 0"
          class="mt-2"
        >
          <v-col
            cols="12"
          >
            <v-treeview
              :items="state"
              item-value="id"
              open-all
            >
              <template #prepend="{ item }">
                {{ item.active === 'Active' ? item.name : `${item.name} (Inactive)` }}
              </template>
              <template #append="{ item }">
                <v-checkbox
                  v-model="item.permissions.access"
                  class="ml-2"
                  color="primary"
                  label="Access"
                />
                <v-checkbox
                  v-model="item.permissions.create"
                  class="ml-2"
                  color="primary"
                  label="Create"
                />
                <v-checkbox
                  v-model="item.permissions.update"
                  class="ml-2"
                  color="primary"
                  label="Update"
                />
                <v-checkbox
                  v-model="item.permissions.delete"
                  class="ml-2"
                  color="primary"
                  label="Delete"
                />
              </template>
            </v-treeview>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import type { IResponseRole } from '@/model/role-interface';
import type { IRequestRoleMenu, IResponseRoleMenu, IResTreeMenu } from '@/model/role-menu-interface';
import { add, list } from '@/service/AppManagement/rolemenu';
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import { getProfile } from '@/utils/tools';

const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;

// props
const props = defineProps(propsForm<IResponseRole>());
const emit = defineEmits(emitsGlobal);

// loading
const { loading, resultLoading } = useLoadingForm();

// data
const state = ref<IResponseRoleMenu[] | null>(null);

function flattenMenuTree(tree: IResTreeMenu[]): IRequestRoleMenu[] {
  const result: IRequestRoleMenu[] = [];

  function recurse(nodes: IResTreeMenu[]) {
    for (const node of nodes) {
      result.push({
        menu_id: node.id,
        access: node.permissions.access,
        create: node.permissions.create,
        update: node.permissions.update,
        delete: node.permissions.delete,
        approval: node.permissions.approval,
        approval_2: node.permissions.approval_2,
        approval_3: node.permissions.approval_3,
      });

      if (node.children && node.children.length > 0) {
        recurse(node.children);
      }
    }
  }

  recurse(tree);
  return result;
}

const submitForm = () => {
  if (!state.value || !props.selectData) return;
  loading.submit = true;
  const flatPayload = flattenMenuTree(state.value);

  add(props.selectData.id, flatPayload)
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

const fetchForm = () => {
  if (props.selectData) {
    loading.data = true;

    list(props.selectData.id)
      .then(({data}) => {
        state.value = data.data;
      })
      .catch(() => {})
      .finally(() => {
        loading.data = false;
      });
  }
};

fetchForm();
</script>
