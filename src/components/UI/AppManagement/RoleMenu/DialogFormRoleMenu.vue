<!-- eslint-disable vue/no-v-html -->
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
        
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-table v-if="state !== null && state.length > 0">
                <thead>
                  <tr>
                    <th class="text-left">
                      Menu
                    </th>
                    <th class="text-left">
                      Access
                    </th>
                    <th class="text-left">
                      Create
                    </th>
                    <th class="text-left">
                      Update
                    </th>
                    <th class="text-left">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in flattenedItems"
                    :key="item.id"
                    :class="{ 'child-row': item.level > 0 }"
                  >
                    <td>
                      <div class="d-flex align-center">
                        <div 
                          v-if="item.level > 0" 
                          class="ml-4"
                          v-html="item.indent"
                        />
                        <span
                          v-if="item.level > 0"
                          class="mr-1"
                        >{{ item.prefix }}</span>
                        <span :class="item.level === 0 ? 'font-weight-medium' : 'text-body-2'">
                          {{ item.active === 'Active' ? item.name : `${item.name} (Inactive)` }}
                        </span>
                      </div>
                    </td>
                    <td class="text-left">
                      <v-checkbox
                        v-model="item.permissions.access"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </td>
                    <td class="text-left">
                      <v-checkbox
                        v-model="item.permissions.create"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </td>
                    <td class="text-left">
                      <v-checkbox
                        v-model="item.permissions.update"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </td>
                    <td class="text-left">
                      <v-checkbox
                        v-model="item.permissions.delete"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
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

// Flatten tree for table display
const flattenedItems = computed(() => {
  if (!state.value) return [];
  
  const result: Array<IResponseRoleMenu & { level: number; indent: string; prefix: string }> = [];
  
  const flatten = (items: IResponseRoleMenu[], level: number = 0) => {
    items.forEach(item => {
      result.push({
        ...item,
        level,
        indent: '&nbsp;'.repeat(level * 4),
        prefix: level > 0 ? '└─ ' : ''
      });
      
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1);
      }
    });
  };
  
  flatten(state.value);
  return result;
});

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
