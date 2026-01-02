import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import TrainingSchedulesManager from '@/components/UI/Setting/TrainingSchedules/TrainingSchedulesManager.vue';
import { listTrainingSchedules, sortTrainingSchedules, deleteTrainingSchedule } from '@/service/Setting/trainingSchedules';
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

vi.mock('@/service/Setting/trainingSchedules', () => ({
  listTrainingSchedules: vi.fn(),
  sortTrainingSchedules: vi.fn(),
  deleteTrainingSchedule: vi.fn(),
}));

vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel', 'update:modelValue'],
  },
}));

vi.mock('@/components/UI/Setting/TrainingSchedules/DialogFormTrainingSchedule.vue', () => ({
  default: {
    name: 'DialogFormTrainingSchedule',
    template: '<div data-testid="dialog-form-training-schedule">Dialog Form Training Schedule</div>',
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

describe('TrainingSchedulesManager', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const mountComponent = (permission: IResPermission) => {
    wrapper = mount(TrainingSchedulesManager, {
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
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllMocks();
  });

  test('fetch list on mount', async () => {
    vi.mocked(listTrainingSchedules).mockResolvedValue({
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

    expect(listTrainingSchedules).toHaveBeenCalledTimes(1);
  });

  test('submitSort calls sort service with current order', async () => {
    vi.mocked(listTrainingSchedules).mockResolvedValue({
      data: {
        success: true,
        count: 2,
        data: [
          {
            id: 11,
            day_of_week: 1,
            start_time: '09:00',
            end_time: '10:00',
            category: 'A',
            member_id: null,
            display_order: 1,
            is_published: true,
            created_by: 0,
            updated_by: 0,
            created_at: '2026-01-01',
            updated_at: '2026-01-01',
          },
          {
            id: 12,
            day_of_week: 2,
            start_time: '19:00',
            end_time: '21:00',
            category: 'B',
            member_id: 1,
            display_order: 2,
            is_published: false,
            member: { id: 1, name: 'Coach', username: 'coach', photo: null, active: true },
            created_by: 0,
            updated_by: 0,
            created_at: '2026-01-01',
            updated_at: '2026-01-01',
          },
        ],
      },
    } as AxiosResponse);

    vi.mocked(sortTrainingSchedules).mockResolvedValue({
      data: { success: true, message: 'ok' },
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

    await flushPromises();

    const updateSortBtn = wrapper.find('[data-testid="update-sort-training-schedule-btn"]');
    expect(updateSortBtn.exists()).toBe(true);
    await updateSortBtn.trigger('click');
    await flushPromises();

    expect(sortTrainingSchedules).toHaveBeenCalledWith({ ids: ['11', '12'] });
  });

  test('confirm delete calls delete service when confirmed', async () => {
    vi.mocked(listTrainingSchedules).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(deleteTrainingSchedule).mockResolvedValue({
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

    expect(deleteTrainingSchedule).toHaveBeenCalledWith(99);
  });
});

