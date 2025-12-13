<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Import Members</span>
      <v-btn
        variant="text"
        color="primary"
        class="mr-2 mb-2"
        icon="mdi-close"
        :loading="resultLoading"
        @click="closeDialog"
      />
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitImport">
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
    <!-- Removed bottom close button; close icon moved to header -->
  </v-card>
</template>

<script lang="ts" setup>
import { useLoadingForm } from '@/utils/loading';
import { importExcel } from '@/service/Setting/member';
import * as XLSX from 'xlsx';
import { validateHeaders, validateRows } from '@/utils/setting/member/import-utils';

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'refreshPage'): void }>();

const swal = inject('$swal') as typeof import('sweetalert2').default;
const { loading, resultLoading } = useLoadingForm();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const fileName = ref<string>('');

const openFileInput = () => {
  fileInputRef.value?.click();
};

const closeDialog = () => {
  emit('update:modelValue', false);
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

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const headerCheck = validateHeaders(sheet);
      if (!headerCheck.valid) {
        swal.fire({ icon: 'error', title: 'Header tidak valid', text: `Kolom wajib: ${headerCheck.missing.join(', ')}` });
        loading.submit = false;
        return;
      }
      const rowCheck = validateRows(sheet);
      if (rowCheck.errors.length > 0) {
        swal.fire({ icon: 'error', title: 'Data tidak valid', text: rowCheck.errors.slice(0, 10).join('; ') });
        loading.submit = false;
        return;
      }
      if (rowCheck.duplicates.length > 0) {
        swal.fire({ icon: 'error', title: 'Duplikasi username', text: rowCheck.duplicates.slice(0, 10).join(', ') });
        loading.submit = false;
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile.value!, selectedFile.value!.name);
      importExcel(formData)
        .then(({ data }) => {
          swal.fire({ icon: 'success', title: 'Import berhasil', text: data.message ?? 'Berhasil import' });
          emit('update:modelValue', false);
          emit('refreshPage');
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          loading.submit = false;
        });
    } catch (err) {
      console.error(err);
      loading.submit = false;
    }
  };
  reader.onerror = () => {
    loading.submit = false;
  };
  reader.readAsArrayBuffer(selectedFile.value);
};
</script>

<style scoped>
.text-none {
  text-transform: none;
}
</style>
