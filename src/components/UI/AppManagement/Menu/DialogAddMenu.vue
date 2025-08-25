<template>
  <v-card>
    <div class="pa-6 bg-white rounded-lg">
      <v-row class="d-flex align-center">
        <v-col cols="6">
          <div class="font-24 font-weight-bold">
            Add
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

      <v-row class="mt-2">
        <v-col cols="12">
          <div class="elevation-3 rounded-lg pa-4">
            <form-data
              :id="selectData?.id"
              @refresh-page="moduleRefreshPage"
              @change-loading="(data) => loading.submit = data"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useLoadingForm } from '@/utils/loading';
import { emitsGlobal, propsForm } from '@/utils/props';
import FormData from './FormDataMenu.vue';
import type { IResponseMenu } from '@/model/menu-interface';

const route = useRoute();

// props
defineProps(propsForm<IResponseMenu>());
const emit = defineEmits(emitsGlobal);

// loading
const { loading, resultLoading } = useLoadingForm();

const moduleRefreshPage = () => {
  emit('refreshPage');
  emit('closeDialog');
};
</script>
