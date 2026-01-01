import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import AboutTimelinesManager from '@/components/UI/Setting/Landing/AboutTimelines/AboutTimelinesManager.vue';
import { deleteAboutTimeline, listAboutTimelines } from '@/service/Setting/aboutTimelines';
import type { IResPermission } from '@/model/auth-interface';

vi.mock('@/service/Setting/aboutTimelines', () => ({
  listAboutTimelines: vi.fn(),
  deleteAboutTimeline: vi.fn(),
}));

vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel', 'update:modelValue'],
  },
}));

vi.mock('@/components/UI/Setting/Landing/AboutTimelines/DialogFormAboutTimeline.vue', () => ({
  default: {
    name: 'DialogFormAboutTimeline',
    template: '<div data-testid="dialog-form-about-timeline">Dialog Form About Timeline</div>',
    props: ['selectData'],
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

describe('AboutTimelinesManager', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const mountComponent = (permission: IResPermission) => {
    wrapper = mount(AboutTimelinesManager, {
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
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    vi.clearAllMocks();
  });

  test('fetches timelines on mount then renders empty state', async () => {
    vi.mocked(listAboutTimelines).mockResolvedValue({
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

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(listAboutTimelines).toHaveBeenCalledTimes(1);
    expect(listAboutTimelines).toHaveBeenCalledWith(undefined);
    expect(wrapper.text()).toContain('No Data');
    expect(wrapper.find('[data-testid="add-about-timeline-btn"]').exists()).toBe(true);
  });

  test('applies published filter when fetchTimelines called', async () => {
    vi.mocked(listAboutTimelines).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: false,
      update: true,
      delete: false,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    (wrapper.vm as unknown as { publishedFilter: string }).publishedFilter = 'true';
    await (wrapper.vm as unknown as { fetchTimelines: () => void }).fetchTimelines();

    expect(listAboutTimelines).toHaveBeenLastCalledWith({ is_published: true });
  });

  test('confirm delete calls delete service when confirmed', async () => {
    vi.mocked(listAboutTimelines).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(deleteAboutTimeline).mockResolvedValue({
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

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as unknown as { confirmDelete: (id: number) => void };
    vm.confirmDelete(99);

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(deleteAboutTimeline).toHaveBeenCalledWith(99);
  });
});

