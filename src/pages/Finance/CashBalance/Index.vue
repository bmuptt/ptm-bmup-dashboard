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
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          class="pa-6"
          elevation="3"
          :loading="resultLoading"
        >
          <v-row>
            <v-col cols="12">
              <p class="text-subtitle-1 text-medium-emphasis mb-2">
                Cash Balance Saat Ini
              </p>
              <p class="display-1 font-weight-bold">
                {{ formattedBalance }}
              </p>
              <p
                v-if="errorMessage"
                class="text-caption text-error mt-2"
              >
                {{ errorMessage }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-card
          v-if="permission?.update"
          class="pa-6"
          elevation="3"
          :loading="resultLoading"
        >
          <v-form @submit.prevent="submitTransaction(formState.type)">
            <v-row>
              <v-col cols="12">
                <p class="text-subtitle-1 text-medium-emphasis mb-2">
                  Update Cash Balance
                </p>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-radio-group
                  v-model="formState.type"
                  inline
                >
                  <template #label>
                    <div>Jenis Transaksi</div>
                  </template>
                  <v-radio
                    color="primary"
                    value="debit"
                  >
                    <template #label>
                      <div>Debit (Pemasukan)</div>
                    </template>
                  </v-radio>
                  <v-radio
                    color="primary"
                    value="credit"
                  >
                    <template #label>
                      <div>Kredit (Pengeluaran)</div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="formState.value"
                  class="mt-2"
                  density="compact"
                  type="number"
                  min="0"
                  label="Nominal"
                  variant="outlined"
                  clearable
                  :error-messages="v$.value.$errors.map((e) => e.$message as string)"
                  @blur="v$.value.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formState.description"
                  class="mt-2"
                  density="compact"
                  label="Deskripsi"
                  variant="outlined"
                  clearable
                  :error-messages="v$.description.$errors.map((e) => e.$message as string)"
                  @blur="v$.description.$touch()"
                />
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12">
                <v-btn
                  type="submit"
                  color="primary"
                  class="text-none"
                  :loading="resultLoading"
                  :disabled="v$.$invalid"
                >
                  Simpan Transaksi
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-6">
      <v-col cols="12">
        <HistoryList />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import type { CashBalanceTransactionType, ICashBalanceData, ICashBalanceFormState } from '@/model/finance-interface';
import { getCashBalance, updateCashBalance } from '@/service/Finance/cashBalance';
import { useLoadingComponent } from '@/utils/loading';
import { rules } from '@/utils/finance/cashBalance/form';
import HistoryList from '@/components/UI/Finance/CashBalance/HistoryList.vue';
import type { IResPermission } from '@/model/auth-interface';
import { getPermission } from '@/service/auth';

const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;

const { loading, resultLoading } = useLoadingComponent();
const permission = ref<IResPermission | null>(null);

const balance = ref<number | null>(null);
const errorMessage = ref<string | null>(null);
const formState = reactive<ICashBalanceFormState>({
  value: null,
  description: '',
  type: 'debit',
});

const v$ = useVuelidate(rules, formState);

const formattedBalance = computed(() => {
  if (balance.value === null) {
    return resultLoading.value ? 'Loading...' : 'Rp 0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance.value);
});

const fetchCashBalance = () => {
  loading.data = true;
  errorMessage.value = null;

  getCashBalance()
    .then(({ data }) => {
      const responseData: ICashBalanceData | undefined = data?.data;
      balance.value = typeof responseData?.balance === 'number' ? responseData.balance : 0;
    })
    .catch((error) => {
      console.error('Error fetching cash balance:', error);
      errorMessage.value = 'Gagal mengambil data cash balance.';
      balance.value = 0;
    })
    .finally(() => {
      loading.data = false;
    });
};

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

const submitTransaction = (transactionType: CashBalanceTransactionType) => {
  v$.value.$touch();

  if (v$.value.$invalid || formState.value === null) {
    return;
  }

  loading.submit = true;
  errorMessage.value = null;

  const payload = {
    status: transactionType === 'debit',
    value: Number(formState.value),
    description: formState.description,
  };

  return updateCashBalance(payload)
    .then(({ data }) => {
      swal.fire('Success', data.message || 'Cash balance berhasil diupdate', 'success');
      formState.value = null;
      formState.description = '';
      v$.value.$reset();
      fetchCashBalance();
    })
    .catch((error) => {
      console.error('Error updating cash balance:', error);
      errorMessage.value = 'Gagal mengupdate cash balance.';
    })
    .finally(() => {
      loading.submit = false;
    });
};

onMounted(() => {
  fetchPermission();
  fetchCashBalance();
});
</script>
