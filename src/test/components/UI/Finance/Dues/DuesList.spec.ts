import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { reactive, ref } from 'vue';
import type { AxiosResponse } from 'axios';
import DuesList from '@/components/UI/Finance/Dues/DuesList.vue';
import { getMembershipDues, updateMembershipDues } from '@/service/Finance/membershipDues';
import type { IMembershipDuesResponse } from '@/model/finance-interface';

// Mock service
vi.mock('@/service/Finance/membershipDues', () => ({
  getMembershipDues: vi.fn(),
  updateMembershipDues: vi.fn(),
}));

// Mock loading utils
vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: reactive({
      data: false,
    }),
  }),
}));

// Mock confirm dialog utils
const showConfirmMock = vi.fn();
vi.mock('@/utils/confirm-dialog', () => ({
  useConfirmDialog: () => ({
    showDialog: ref(false),
    dialogOptions: ref({
      title: '',
      html: '',
    }),
    showConfirm: showConfirmMock,
    handleConfirm: vi.fn(),
    handleCancel: vi.fn(),
  }),
}));

// Mock data
const mockResponsePage1: IMembershipDuesResponse = {
  items: [
    {
      member: { id: 1, name: 'Member One', photo: null },
      months: [
        { month: 1, status: 'paid', amount: 15000, id: 1 },
        { month: 2, status: 'unpaid', amount: 0, id: null },
      ],
    },
  ],
  meta: { nextCursor: 2, hasMore: true, limit: 10 },
  pagination: { currentPage: 1, itemsPerPage: 10, totalItems: 20, totalPages: 2 },
};

const mockResponsePage2: IMembershipDuesResponse = {
  items: [
    {
      member: { id: 2, name: 'Member Two', photo: null },
      months: [],
    },
  ],
  meta: { nextCursor: null, hasMore: false, limit: 10 },
  pagination: { currentPage: 2, itemsPerPage: 10, totalItems: 20, totalPages: 2 },
};

describe('DuesList Component', () => {
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

  const createWrapper = (props = { periodYear: 2025 }) => {
    return mount(DuesList, {
      props,
      global: {
        plugins: [vuetify],
        stubs: {
            ConfirmDialog: true,
            UploadProofDialog: true,
        }
      },
    });
  };

  test('loads first page on mount', async () => {
    vi.mocked(getMembershipDues).mockResolvedValue({
      data: mockResponsePage1,
    } as AxiosResponse);

    wrapper = createWrapper();
    await flushPromises();

    expect(getMembershipDues).toHaveBeenCalledWith({
      limit: 10,
      page: 1,
      period_year: 2025,
      search: undefined,
    });
    const items = wrapper.findAll('[data-testid="dues-item"]');
    expect(items.length).toBe(1);
    expect(wrapper.text()).toContain('Member One');
  });

  test('loads more when load more clicked', async () => {
    vi.mocked(getMembershipDues)
      .mockResolvedValueOnce({ data: mockResponsePage1 } as AxiosResponse)
      .mockResolvedValueOnce({ data: mockResponsePage2 } as AxiosResponse);

    wrapper = createWrapper();
    await flushPromises();

    const loadMoreBtn = wrapper.find('[data-testid="load-more-btn"]');
    expect(loadMoreBtn.exists()).toBe(true);
    await loadMoreBtn.trigger('click');
    await flushPromises();

    expect(getMembershipDues).toHaveBeenCalledTimes(2);
    expect(getMembershipDues).toHaveBeenLastCalledWith({
      limit: 10,
      period_year: 2025,
      search: undefined,
      page: 2,
    });
    
    const items = wrapper.findAll('[data-testid="dues-item"]');
    expect(items.length).toBe(2);
  });

  test('updates status when checkbox clicked and confirmed', async () => {
    vi.mocked(getMembershipDues).mockResolvedValue({
      data: mockResponsePage1,
    } as AxiosResponse);
    vi.mocked(updateMembershipDues).mockResolvedValue({} as AxiosResponse);
    showConfirmMock.mockResolvedValue(true); // User confirms

    wrapper = createWrapper();
    await flushPromises();

    // Find the second month (unpaid) checkbox for the first member
    const checkboxes = wrapper.findAllComponents(components.VCheckbox);
    expect(checkboxes.length).toBe(2); // Jan and Feb
    
    // Click the second checkbox (Feb, unpaid -> paid)
    // Trigger update:modelValue event
    await checkboxes[1].trigger('click'); 
    // Note: VCheckbox might need 'update:modelValue' emitted or change event.
    // Triggering click on VCheckbox usually works if it handles click to toggle.
    // But since we bind @update:model-value, let's emit it manually to be safe
    await checkboxes[1].vm.$emit('update:modelValue', true);

    expect(showConfirmMock).toHaveBeenCalled();
    expect(updateMembershipDues).toHaveBeenCalledWith({
      member_id: 1,
      period_year: 2025,
      period_month: 2,
      status: 'paid',
    });
  });

  test('does not update status when checkbox clicked and cancelled', async () => {
    vi.mocked(getMembershipDues).mockResolvedValue({
      data: mockResponsePage1,
    } as AxiosResponse);
    showConfirmMock.mockResolvedValue(false); // User cancels

    wrapper = createWrapper();
    await flushPromises();

    const checkboxes = wrapper.findAllComponents(components.VCheckbox);
    
    // Click the second checkbox (Feb, unpaid -> paid)
    await checkboxes[1].vm.$emit('update:modelValue', true);

    expect(showConfirmMock).toHaveBeenCalled();
    expect(updateMembershipDues).not.toHaveBeenCalled();
  });

  test('resets list when search changes', async () => {
    vi.mocked(getMembershipDues).mockResolvedValue({
      data: mockResponsePage1,
    } as AxiosResponse);

    wrapper = createWrapper();
    await flushPromises();

    await wrapper.setProps({ search: 'new search' });
    await flushPromises();

    expect(getMembershipDues).toHaveBeenCalledTimes(2); // Initial + Search change
    expect(getMembershipDues).toHaveBeenLastCalledWith({
      limit: 10,
      period_year: 2025,
      search: 'new search',
      page: 1,
    });
  });

  test('shows upload button for paid month and refreshes after success', async () => {
    vi.mocked(getMembershipDues).mockResolvedValue({
      data: mockResponsePage1,
    } as AxiosResponse);

    wrapper = createWrapper();
    await flushPromises();

    const uploadBtns = wrapper.findAll('[data-testid="upload-proof-btn"]');
    expect(uploadBtns.length).toBe(1); // Only January is paid with id

    await uploadBtns[0].trigger('click');

    // Emit success from dialog and expect list to refresh
    const dialog = wrapper.findComponent({ name: 'UploadProofDialog' });
    dialog.vm.$emit('success');
    await flushPromises();

    expect(getMembershipDues).toHaveBeenCalledTimes(2);
    expect(getMembershipDues).toHaveBeenLastCalledWith({
      limit: 10,
      period_year: 2025,
      search: undefined,
      page: 1,
    });
  });

  test('after load more, upload success resets to page 1 and re-shows Load More', async () => {
    // 1) Initial page 1
    vi.mocked(getMembershipDues)
      .mockResolvedValueOnce({ data: mockResponsePage1 } as AxiosResponse)
      // 2) Load more -> page 2
      .mockResolvedValueOnce({ data: mockResponsePage2 } as AxiosResponse)
      // 3) Upload success -> reset to page 1
      .mockResolvedValueOnce({ data: mockResponsePage1 } as AxiosResponse);

    wrapper = createWrapper();
    await flushPromises();

    // Ensure Load More is visible initially (hasMore from pagination)
    let loadMoreBtn = wrapper.find('[data-testid="load-more-btn"]');
    expect(loadMoreBtn.exists()).toBe(true);

    // Click Load More -> should append page 2 items
    await loadMoreBtn.trigger('click');
    await flushPromises();

    // Now items should be 2 (page1 + page2)
    let items = wrapper.findAll('[data-testid="dues-item"]');
    expect(items.length).toBe(2);

    // Open upload proof from first item (has paid month with id)
    const uploadBtns = wrapper.findAll('[data-testid="upload-proof-btn"]');
    expect(uploadBtns.length).toBe(1);
    await uploadBtns[0].trigger('click');

    // Emit success from dialog -> component should fetch page 1 with reset
    const dialog = wrapper.findComponent({ name: 'UploadProofDialog' });
    dialog.vm.$emit('success');
    await flushPromises();

    // Three calls total: page1, page2, reset page1
    expect(getMembershipDues).toHaveBeenCalledTimes(3);
    expect(getMembershipDues).toHaveBeenLastCalledWith({
      limit: 10,
      period_year: 2025,
      search: undefined,
      page: 1,
    });

    // Items should be reset to only page 1 contents
    items = wrapper.findAll('[data-testid="dues-item"]');
    expect(items.length).toBe(1);

    // Load More should be visible again (since page 1 has totalPages = 2)
    loadMoreBtn = wrapper.find('[data-testid="load-more-btn"]');
    expect(loadMoreBtn.exists()).toBe(true);
  });
});
