<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <TrainingSchedulesManager :permission="permission" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { getPermission } from '@/service/auth';
import type { IResPermission } from '@/model/auth-interface';
import { useLoadingComponent } from '@/utils/loading';
import TrainingSchedulesManager from '@/components/UI/Setting/TrainingSchedules/TrainingSchedulesManager.vue';

const route = useRoute();

const { loading } = useLoadingComponent();
const permission = ref<IResPermission | null>(null);

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
    .finally(() => {
      loading.permission = false;
    });
};

fetchPermission();
</script>

