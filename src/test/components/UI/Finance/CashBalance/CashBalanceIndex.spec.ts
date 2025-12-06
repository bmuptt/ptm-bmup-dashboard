import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import type { AxiosResponse } from 'axios';
import CashBalanceIndex from '@/pages/Finance/CashBalance/Index.vue';
import { getCashBalance, updateCashBalance } from '@/service/Finance/cashBalance';
import { responseCashBalanceSuccess, responseCashBalanceError } from '@/test/mock/cash-balance-mock';

vi.mock('@/service/Finance/cashBalance', () => ({
  getCashBalance: vi.fn(),
  updateCashBalance: vi.fn(),
}));

vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: {
      data: false,
      submit: false,
      permission: false,
      role: false,
    },
    resultLoading: false,
  }),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn().mockResolvedValue({
    data: {
      data: {
        access: true,
        create: true,
        update: true,
        delete: true,
        approval: true,
        approval_2: true,
        approval_3: true,
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  } as AxiosResponse),
}));

describe('Cash Balance Index Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;
  let router: Router;

  beforeEach(() => {
    vuetify = createVuetify({
      theme: {
        defaultTheme: 'customTheme',
        themes: {
          customTheme: {
            dark: false,
            colors: {
              primary: '#0D47A1',
            },
          },
        },
      },
    });

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/finance/cash-balance',
          component: { template: '<div>Cash Balance</div>' },
          meta: { label: 'Cash Balance' },
        },
      ],
    });

    router.currentRoute.value = {
      matched: [
        { meta: { label: 'Finance' } },
        { meta: { label: 'Cash Balance' } },
        { meta: { label: 'Cash Balance' } },
      ],
    } as unknown as typeof router.currentRoute.value;

    vi.clearAllMocks();

    vi.mocked(getCashBalance).mockResolvedValue({
      data: responseCashBalanceSuccess.data,
      status: responseCashBalanceSuccess.status,
      statusText: responseCashBalanceSuccess.statusText,
      headers: {},
      config: {},
    } as AxiosResponse);

    vi.mocked(updateCashBalance).mockResolvedValue({
      data: responseCashBalanceSuccess.data,
      status: responseCashBalanceSuccess.status,
      statusText: responseCashBalanceSuccess.statusText,
      headers: {},
      config: {},
    } as AxiosResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (): VueWrapper => {
    return mount(CashBalanceIndex, {
      global: {
        plugins: [vuetify, router],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
        stubs: {
          'v-row': { template: '<div data-testid="v-row"><slot /></div>' },
          'v-col': { template: '<div data-testid="v-col"><slot /></div>' },
          'v-card': { template: '<div data-testid="v-card"><slot /></div>' },
          'v-form': { template: '<form data-testid="v-form"><slot /></form>' },
          'v-text-field': { template: '<input data-testid="v-text-field" />' },
          'v-radio-group': { template: '<div data-testid="v-radio-group"><slot /></div>' },
          'v-radio': { template: '<div data-testid="v-radio"><slot /></div>' },
          'v-btn': { template: '<button data-testid="v-btn"><slot /></button>' },
          HistoryList: { template: '<div data-testid="history-list-stub" />' },
        },
      },
    });
  };

  test('should render current cash balance card', async () => {
    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    expect(getCashBalance).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Cash Balance');
  });

  test('should submit debit transaction successfully', async () => {
    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    const component = wrapper.vm as unknown as {
      formState: { value: number | null; description: string; type: string };
      submitTransaction: (type: 'debit' | 'credit') => void;
    };

    component.formState.value = 1000.5;
    component.formState.description = 'Initial cash';
    component.formState.type = 'debit';

    await component.submitTransaction('debit');

    expect(updateCashBalance).toHaveBeenCalledWith({
      status: true,
      value: 1000.5,
      description: 'Initial cash',
    });
  });

  test('should submit credit transaction successfully', async () => {
    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    const component = wrapper.vm as unknown as {
      formState: { value: number | null; description: string; type: string };
      submitTransaction: (type: 'debit' | 'credit') => void;
    };

    component.formState.value = 500;
    component.formState.description = 'Pengeluaran kas';
    component.formState.type = 'credit';

    await component.submitTransaction('credit');

    expect(updateCashBalance).toHaveBeenCalledWith({
      status: false,
      value: 500,
      description: 'Pengeluaran kas',
    });
  });

  test('should handle update cash balance error', async () => {
    vi.mocked(updateCashBalance).mockRejectedValue(responseCashBalanceError);

    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    const component = wrapper.vm as unknown as {
      formState: { value: number | null; description: string; type: string };
      submitTransaction: (type: 'debit' | 'credit') => void;
      errorMessage: string | null;
    };

    component.formState.value = 200;
    component.formState.description = 'Test error';
    component.formState.type = 'debit';

    await component.submitTransaction('debit');

    expect(updateCashBalance).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Gagal mengupdate cash balance.');
  });
});
