<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <h1 class="text-h4 mb-4">
          Membership Dues
        </h1>
      </v-col>
    </v-row>

    <v-card
      flat
      class="mb-4 pa-4"
      elevation="3"
    >
      <v-row align="center">
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="periodYear"
            :items="availableYears"
            label="Period Year"
            variant="outlined"
            density="compact"
            hide-details
            data-testid="year-select"
          />
        </v-col>
        <v-col
          cols="12"
          sm="5"
        >
          <v-text-field
            v-model="searchInput"
            label="Search Member"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            data-testid="search-input"
            @change="search = searchInput"
            @click:clear="search = ''; searchInput = ''"
          />
        </v-col>
        <v-col
          cols="12"
          sm="4"
          class="d-flex gap-2 justify-end"
        >
          <v-btn
            v-if="permission?.access"
            color="success"
            prepend-icon="mdi-microsoft-excel"
            :loading="resultLoading"
            :disabled="resultLoading"
            variant="outlined"
            class="text-none"
            @click="handleExport('excel')"
          >
            Excel
          </v-btn>
          <v-btn
            v-if="permission?.access"
            color="error"
            prepend-icon="mdi-file-pdf-box"
            :loading="resultLoading"
            :disabled="resultLoading"
            variant="outlined"
            class="ml-2 text-none"
            @click="handleExport('pdf')"
          >
            PDF
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <DuesList
      ref="duesListRef"
      :period-year="periodYear"
      :search="search"
      :can-update="permission?.update"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DuesList from '@/components/UI/Finance/Dues/DuesList.vue';
import { fetchAllMembershipDues, exportToExcel, exportToPDF } from '@/utils/finance/export-dues';
import { useLoadingComponent } from '@/utils/loading';
import type { IResPermission } from '@/model/auth-interface';
import { getPermission } from '@/service/auth';

const periodYear = ref(new Date().getFullYear());
const search = ref('');
const searchInput = ref('');
const duesListRef = ref<InstanceType<typeof DuesList> | null>(null);
const { loading, resultLoading } = useLoadingComponent();
const permission = ref<IResPermission | null>(null);

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push(i);
  }
  return years;
});

async function handleExport(type: 'excel' | 'pdf') {
  loading.submit = true;
  try {
    const data = await fetchAllMembershipDues(periodYear.value, search.value); // Removed console.log callback

    if (type === 'excel') {
      exportToExcel(data, periodYear.value);
    } else {
      exportToPDF(data, periodYear.value);
    }
  } catch (error) {
    console.error(`Failed to export ${type}:`, error);
    // Handle error (maybe show a snackbar)
  } finally {
    loading.submit = false;
  }
}

const fetchPermission = () => {
  loading.permission = true;
  const paramsPermission = {
    key_menu: (useRoute().matched[2]?.name as string) || '',
  };
  getPermission(paramsPermission)
    .then(({ data }) => {
      permission.value = data.data;
    })
    .catch(() => {})
    .finally(() => (loading.permission = false));
};

fetchPermission();
</script>
