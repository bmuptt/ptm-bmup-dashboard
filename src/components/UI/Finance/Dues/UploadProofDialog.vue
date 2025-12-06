<template>
  <v-dialog
    v-model="dialog"
    max-width="520"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6">
        Upload Bukti Pembayaran
      </v-card-title>

      <v-card-text>
        <div class="mb-3">
          <div class="text-body-2">
            <strong>Anggota:</strong> {{ data?.member_name }}
          </div>
          <div class="text-body-2">
            <strong>Periode:</strong> {{ data ? monthName(data.month) : '' }} {{ data?.period_year }}
          </div>
          <div class="text-body-2">
            <strong>Status:</strong> {{ data?.current_status }}
          </div>
        </div>

        <!-- Preview + edit icon mengikuti pola Setting/Core -->
        <div class="d-flex align-center mt-3">
          <div class="proof-container position-relative mr-4">
            <v-img
              :key="imageSrc"
              :src="imageSrc"
              width="80"
              height="80"
              cover
              class="rounded border"
              alt="Preview Bukti"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              color="primary"
              class="proof-edit-btn"
              :disabled="resultLoading"
              @click="openFileInput"
            />
          </div>
          <div class="flex-grow-1">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf"
              style="display: none;"
              @change="handleFileChange"
            >
            <div class="text-caption text-grey">
              Format: JPEG, PNG, JPG, GIF, PDF | Maksimal: 2MB
            </div>
            <div
              v-if="previewSrc === 'pdf'"
              class="text-caption mt-1"
            >
              File PDF
            </div>
            <v-btn
              v-if="hasRealProof"
              color="error"
              variant="outlined"
              size="small"
              class="mt-2"
              :disabled="resultLoading"
              @click="deleteProof"
            >
              Hapus Bukti
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          color="grey"
          @click="close"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :loading="resultLoading"
          :disabled="resultLoading"
          @click="submit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { IUploadProofDialogData, IUploadMembershipDuesProofRequest, IMembershipDuesDetailData } from '@/model/finance-interface';
import { uploadMembershipDuesProof, getMembershipDuesDetail } from '@/service/Finance/membershipDues';
import { useLoadingForm } from '@/utils/loading';

const props = defineProps<{
  modelValue: boolean;
  data: IUploadProofDialogData | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const { loading, resultLoading } = useLoadingForm();

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const statusFile = ref<0 | 1>(0);
const file = ref<File | null>(null);
const previewSrc = ref<string | null>(null);
const duesDetail = ref<IMembershipDuesDetailData | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

watch(file, (f) => {
  if (!f) return; // jangan override preview dari server saat file null
  if (f.type.startsWith('image/')) {
    const url = URL.createObjectURL(f);
    previewSrc.value = url;
  } else {
    previewSrc.value = 'pdf';
  }
  // Auto mark as change ketika memilih file
  statusFile.value = 1;
});

const isImagePreview = computed(() => previewSrc.value !== null && previewSrc.value !== 'pdf');
const imageSrc = computed(() => (isImagePreview.value ? (previewSrc.value as string) : '/static/img/no_image.png'));
const hasRealProof = computed(() => previewSrc.value !== null && previewSrc.value !== '/static/img/no_image.png');

function openFileInput() {
  fileInputRef.value?.click();
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const f = input.files && input.files[0] ? input.files[0] : null;
  file.value = f;
}

function monthName(month: number) {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return names[month - 1] || String(month);
}

function close() {
  dialog.value = false;
}

// Fetch detail dues when dialog opens, set preview from detail
watch(dialog, (open) => {
  if (open && props.data) {
    loading.data = true;
    getMembershipDuesDetail(props.data.membership_dues_id)
      .then(({ data }) => {
        duesDetail.value = data?.data ?? null;
        const path = duesDetail.value?.membership_dues?.proof_file_path ?? null;
        if (path) {
          const lower = String(path).toLowerCase();
          previewSrc.value = lower.endsWith('.pdf') ? 'pdf' : path;
        } else {
          previewSrc.value = '/static/img/no_image.png';
        }
        statusFile.value = 0;
        file.value = null;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        loading.data = false;
      });
  }
}, { immediate: true });

function deleteProof() {
  file.value = null;
  statusFile.value = 1;
  if (previewSrc.value && previewSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewSrc.value);
  }
  previewSrc.value = null;
}

function submit() {
  if (!props.data) return;
  loading.submit = true;

  const payload: IUploadMembershipDuesProofRequest = {
    status_file: statusFile.value,
    proof_file: statusFile.value === 1 ? file.value ?? undefined : undefined,
  };

  uploadMembershipDuesProof(props.data.membership_dues_id, payload)
    .then(() => {
      emit('success');
      close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      loading.submit = false;
    });
}
</script>

<style scoped>
.rounded { border-radius: 6px; }
.proof-container { position: relative; display: inline-block; }
.proof-edit-btn { position: absolute; top: -8px; right: -8px; opacity: 0; transition: opacity 0.2s; }
.proof-container:hover .proof-edit-btn { opacity: 1; }
</style>
