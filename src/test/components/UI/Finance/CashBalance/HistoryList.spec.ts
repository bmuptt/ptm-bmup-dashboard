import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import type { AxiosResponse } from 'axios';
import HistoryList from '@/components/UI/Finance/CashBalance/HistoryList.vue';
import { getCashBalanceHistory } from '@/service/Finance/cashBalance';
import { responseHistoryPage1, responseHistoryPage2 } from '@/test/mock/cash-balance-history-mock';

vi.mock('@/service/Finance/cashBalance', () => ({
  getCashBalanceHistory: vi.fn(),
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

describe('HistoryList Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({
      theme: {
        defaultTheme: 'customTheme',
        themes: { customTheme: { dark: false } },
      },
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (): VueWrapper => {
    return mount(HistoryList, {
      global: {
        plugins: [vuetify],
        stubs: {
          'v-card': { template: '<div data-testid="v-card"><slot /></div>' },
          'v-card-title': { template: '<div data-testid="v-card-title"><slot /></div>' },
          'v-card-text': { template: '<div data-testid="v-card-text"><slot /></div>' },
          'v-divider': { template: '<hr data-testid="v-divider" />' },
          'v-list': { template: '<ul data-testid="v-list"><slot /></ul>' },
          'v-list-item': { template: '<li data-testid="v-list-item"><slot /></li>' },
          'v-btn': { template: '<button data-testid="v-btn"><slot /></button>' },
          'v-progress-linear': { template: '<div data-testid="v-progress-linear"></div>' },
        },
      },
    });
  };

  test('loads first page and renders items sorted DESC', async () => {
    vi.mocked(getCashBalanceHistory).mockResolvedValue({
      data: responseHistoryPage1.data,
      status: responseHistoryPage1.status,
      statusText: responseHistoryPage1.statusText,
      headers: {},
      config: {},
    } as AxiosResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(getCashBalanceHistory).toHaveBeenCalledWith({ limit: 10 });
    const listItems = wrapper.findAll('[data-testid="v-list-item"]');
    expect(listItems.length).toBe(2);
    // Should show latest item first and display Debit/Credit and user name
    expect(wrapper.text()).toContain('Debit');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).not.toContain('ID:');
  });

  test('load more uses next cursor and appends items', async () => {
    // First page
    vi.mocked(getCashBalanceHistory).mockResolvedValueOnce({
      data: responseHistoryPage1.data,
      status: responseHistoryPage1.status,
      statusText: responseHistoryPage1.statusText,
      headers: {},
      config: {},
    } as AxiosResponse);
    // Second page
    vi.mocked(getCashBalanceHistory).mockResolvedValueOnce({
      data: responseHistoryPage2.data,
      status: responseHistoryPage2.status,
      statusText: responseHistoryPage2.statusText,
      headers: {},
      config: {},
    } as AxiosResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    // Trigger load more
    const vm = wrapper.vm as unknown as { onLoadMoreClick: () => void };
    vm.onLoadMoreClick();
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    // Expect second call with cursor=2
    expect(getCashBalanceHistory).toHaveBeenLastCalledWith({ limit: 10, cursor: 2 });
    const listItemsAfter = wrapper.findAll('[data-testid="v-list-item"]');
    expect(listItemsAfter.length).toBe(3);
    expect(wrapper.text()).toContain('System');
  });

  test('handles error on initial load', async () => {
    vi.mocked(getCashBalanceHistory).mockRejectedValue(new Error('network'));

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(getCashBalanceHistory).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Gagal memuat history');
  });
});
