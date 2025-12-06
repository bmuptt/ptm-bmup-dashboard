import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import { reactive } from 'vue';
import Index from '@/pages/Finance/Dues/Index.vue';
import { fetchAllMembershipDues, exportToExcel, exportToPDF } from '@/utils/finance/export-dues';

vi.mock('@/service/Finance/membershipDues', () => ({
  getMembershipDues: vi.fn().mockResolvedValue({ data: { items: [], meta: { nextCursor: null } } }),
}));

vi.mock('@/utils/finance/export-dues', () => ({
  fetchAllMembershipDues: vi.fn().mockResolvedValue([]),
  exportToExcel: vi.fn(),
  exportToPDF: vi.fn(),
}));

vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: reactive({
      submit: false,
      data: false,
      permission: false,
    }),
    resultLoading: false,
  }),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      matched: [{}, {}, { name: 'membership-dues' }],
    }),
  };
});

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

// Mock child component
vi.mock('@/components/UI/Finance/Dues/DuesList.vue', () => ({
  default: {
    name: 'DuesList',
    props: ['search', 'periodYear'],
    template: '<div data-testid="dues-list-stub" />',
    methods: {
        fetchPage: vi.fn(),
    }
  },
}));

describe('Dues Index Page', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(Index, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  test('renders correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.text()).toContain('Membership Dues');
    expect(wrapper.find('[data-testid="init-year-btn"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="dues-list-stub"]').exists()).toBe(true);
  });

  test('updates search prop only on change or clear', async () => {
    wrapper = createWrapper();
    const duesList = wrapper.findComponent({ name: 'DuesList' });
    
    // Find VTextField by label to ensure we get the search input, not the one inside VSelect
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const searchInput = textFields.find(w => w.props('label') === 'Search Member');

    expect(searchInput).toBeDefined();
    if (!searchInput) return; // TypeScript guard

    expect(searchInput.exists()).toBe(true);

    // Initial state
    expect(duesList.props('search')).toBe('');

    // Simulate typing (updates v-model searchInput but not search prop)
    await searchInput.vm.$emit('update:modelValue', 'John');
    
    // Verify input value updated (v-model working)
    expect(searchInput.props('modelValue')).toBe('John');
    // Verify search prop NOT updated yet
    expect(duesList.props('search')).toBe('');

    // Simulate change event (updates search prop)
    // Note: In real DOM, change event fires on blur or enter.
    // We simulate it by emitting 'change' from VTextField
    await searchInput.vm.$emit('change');
    expect(duesList.props('search')).toBe('John');

    // Simulate clear (updates search prop and clears input)
    await searchInput.vm.$emit('click:clear');
    expect(duesList.props('search')).toBe('');
  });

  test('calls export functions when buttons are clicked', async () => {
    wrapper = createWrapper();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    
    // Find buttons by text content is tricky with Vuetify structure, use classes or icons if possible
    // Or just find all buttons and filter
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const excelBtn = buttons.find(b => b.text().includes('Excel'));
    const pdfBtn = buttons.find(b => b.text().includes('PDF'));

    expect(excelBtn?.exists()).toBe(true);
    expect(pdfBtn?.exists()).toBe(true);

    // Test Excel Export
    await excelBtn?.trigger('click');
    expect(fetchAllMembershipDues).toHaveBeenCalled();
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(exportToExcel).toHaveBeenCalled();

    // Test PDF Export
    await pdfBtn?.trigger('click');
    expect(fetchAllMembershipDues).toHaveBeenCalledTimes(2);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(exportToPDF).toHaveBeenCalled();
  });
});
