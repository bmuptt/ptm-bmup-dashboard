import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import ActivitiesManager from '@/components/UI/Setting/Landing/Activities/ActivitiesManager.vue';
import { listLandingActivities, sortLandingActivities, deleteLandingActivity } from '@/service/Setting/landingActivities';
import { listLandingIcons } from '@/service/Setting/landingIcons';
import type { IResPermission } from '@/model/auth-interface';

const displayState = vi.hoisted(() => ({
  smAndDown: null as unknown as { value: boolean } | null,
}));

vi.mock('vuetify', async () => {
  const actual = await vi.importActual<typeof import('vuetify')>('vuetify');
  const vue = await vi.importActual<typeof import('vue')>('vue');
  if (!displayState.smAndDown) displayState.smAndDown = vue.ref(false);

  return {
    ...actual,
    useDisplay: () => ({
      smAndDown: displayState.smAndDown!,
    }),
  };
});

vi.mock('vuedraggable', () => ({
  default: {
    name: 'draggable',
    props: ['modelValue', 'tag', 'itemKey'],
    emits: ['update:modelValue'],
    template: `
      <div>
        <slot
          v-for="element in modelValue"
          :key="element.id"
          name="item"
          :element="element"
        />
      </div>
    `,
  },
}));

vi.mock('@/service/Setting/landingActivities', () => ({
  listLandingActivities: vi.fn(),
  sortLandingActivities: vi.fn(),
  deleteLandingActivity: vi.fn(),
}));

vi.mock('@/service/Setting/landingIcons', () => ({
  listLandingIcons: vi.fn(),
}));

vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel', 'update:modelValue'],
  },
}));

vi.mock('@/components/UI/Setting/Landing/Activities/DialogFormActivity.vue', () => ({
  default: {
    name: 'DialogFormActivity',
    template: '<div data-testid="dialog-form-activity">Dialog Form Activity</div>',
    props: ['selectData', 'icons'],
    emits: ['close-dialog', 'refresh-page'],
  },
}));

vi.mock('@/utils/confirm-dialog', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');
  return {
    useConfirmDialog: vi.fn(() => ({
      showDialog: vue.ref(false),
      dialogOptions: vue.ref({
        title: '',
        html: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonColor: '',
        icon: '',
      }),
      showConfirm: vi.fn(() => Promise.resolve(true)),
      handleConfirm: vi.fn(),
      handleCancel: vi.fn(),
    })),
  };
});

describe('ActivitiesManager', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const mountComponent = (permission: IResPermission) => {
    wrapper = mount(ActivitiesManager, {
      props: { permission },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
      },
    });
  };

  beforeEach(() => {
    if (displayState.smAndDown) displayState.smAndDown.value = false;
    vuetify = createVuetify({
      components,
      directives,
    });

    (globalThis as unknown as { visualViewport?: unknown }).visualViewport = {
      width: 1024,
      height: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as VisualViewport;

    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    vi.clearAllMocks();
  });

  test('fetches icons and activities on mount then renders empty state', async () => {
    vi.mocked(listLandingIcons).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(listLandingActivities).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: true,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    expect(listLandingIcons).toHaveBeenCalledTimes(1);
    expect(listLandingActivities).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('No Data');
    expect(wrapper.find('[data-testid="add-activity-btn"]').exists()).toBe(true);
  });

  test('renders mobile empty state without table when smAndDown', async () => {
    if (displayState.smAndDown) displayState.smAndDown.value = true;

    vi.mocked(listLandingIcons).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(listLandingActivities).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: true,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    expect(wrapper.text()).toContain('No Data');
    expect(wrapper.find('table').exists()).toBe(false);
  });

  test('shows Update Sort and submits sort payload by ids', async () => {
    vi.mocked(listLandingIcons).mockResolvedValue({
      data: { success: true, count: 1, data: [{ id: 1, name: 'mdi-home', label: 'Home', is_active: true }] },
    } as AxiosResponse);

    vi.mocked(listLandingActivities).mockResolvedValue({
      data: {
        success: true,
        count: 2,
        data: [
          {
            id: 11,
            icon_id: 1,
            title: 'A',
            subtitle: 'AA',
            is_published: true,
            sort_order: 1,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
            icon: { id: 1, name: 'mdi-home', label: 'Home', is_active: true },
          },
          {
            id: 12,
            icon_id: 1,
            title: 'B',
            subtitle: 'BB',
            is_published: false,
            sort_order: 2,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
            icon: { id: 1, name: 'mdi-home', label: 'Home', is_active: true },
          },
        ],
      },
    } as AxiosResponse);

    vi.mocked(sortLandingActivities).mockResolvedValue({
      data: { success: true, message: 'ok' },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: true,
      update: true,
      delete: false,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    const updateSortBtn = wrapper.find('[data-testid="update-sort-activity-btn"]');
    expect(updateSortBtn.exists()).toBe(true);
    await updateSortBtn.trigger('click');

    await flushPromises();

    expect(sortLandingActivities).toHaveBeenCalledWith({ ids: ['11', '12'] });
  });

  test('confirm delete calls delete service when confirmed', async () => {
    vi.mocked(listLandingIcons).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(listLandingActivities).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(deleteLandingActivity).mockResolvedValue({
      data: { success: true, message: 'deleted' },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: false,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    const vm = wrapper.vm as unknown as { confirmDelete: (id: number) => void };
    vm.confirmDelete(99);

    await flushPromises();

    expect(deleteLandingActivity).toHaveBeenCalledWith(99);
  });
});
