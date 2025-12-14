<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Import Membership Dues</span>
      <v-btn
        variant="text"
        color="primary"
        class="mr-2 mb-2"
        icon="mdi-close"
        :loading="resultLoading"
        @click="emit('update:modelValue', false)"
      />
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitImport">
        <v-row class="mb-2">
          <v-col
            cols="12"
            sm="6"
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
        </v-row>
        <div class="d-flex align-center">
          <input
            ref="fileInputRef"
            type="file"
            accept=".xlsx,.xls"
            style="display: none;"
            @change="handleFileChange"
          >
          <v-btn
            color="primary"
            variant="outlined"
            density="compact"
            prepend-icon="mdi-file-excel"
            :loading="resultLoading"
            class="mr-2 text-none"
            @click="openFileInput"
          >
            Pilih File Excel
          </v-btn>
          <span
            v-if="fileName"
            class="text-caption"
          >{{ fileName }}</span>
        </div>
        <div class="mt-4">
          <v-btn
            type="submit"
            color="success"
            density="compact"
            :loading="resultLoading"
            :disabled="!selectedFile"
            class="text-none"
          >
            Import
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useLoadingForm } from '@/utils/loading';
import { importMembershipDues } from '@/service/Finance/membershipDues';

const props = defineProps<{ modelValue: boolean; defaultYear?: number }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'success'): void }>();

const swal = inject('$swal') as typeof import('sweetalert2').default;
const { loading, resultLoading } = useLoadingForm();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const fileName = ref<string>('');
const periodYear = ref<number>(props.defaultYear ?? new Date().getFullYear());

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push(i);
  }
  return years;
});

const openFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  selectedFile.value = file || null;
  fileName.value = file ? file.name : '';
};

const submitImport = () => {
  if (!selectedFile.value) return;
  const ext = selectedFile.value.name.split('.').pop()?.toLowerCase();
  if (!ext || (ext !== 'xlsx' && ext !== 'xls')) {
    swal.fire({ icon: 'error', title: 'Format tidak valid', text: 'Gunakan file .xlsx atau .xls' });
    return;
  }
  loading.submit = true;

  importMembershipDues(periodYear.value, selectedFile.value)
    .then(({ data }) => {
      const summary = data.data.summary;
      swal.fire({
        icon: 'success',
        title: 'Import Dues Berhasil',
        html: `
          <div style="text-align:left">
            <div>Total Rows: <b>${summary.total_rows}</b></div>
            <div>Processed: <b>${summary.processed_rows}</b></div>
            <div>Success: <b>${summary.success_rows}</b></div>
            <div>Failed: <b>${summary.failed_rows}</b></div>
          </div>
        `
      });
      emit('update:modelValue', false);
      emit('success');
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.submit = false;
    });
};
</script>

<style scoped>
.text-none {
  text-transform: none;
}
</style>

