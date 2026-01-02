import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import AboutTeamMembersManager from '@/components/UI/Setting/Landing/AboutTeamMembers/AboutTeamMembersManager.vue';
import { listAboutTeamMembers, sortAboutTeamMembers, deleteAboutTeamMember } from '@/service/Setting/aboutTeamMembers';
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

vi.mock('@/service/Setting/aboutTeamMembers', () => ({
  listAboutTeamMembers: vi.fn(),
  sortAboutTeamMembers: vi.fn(),
  deleteAboutTeamMember: vi.fn(),
}));

vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel', 'update:modelValue'],
  },
}));

vi.mock('@/components/UI/Setting/Landing/AboutTeamMembers/DialogFormAboutTeamMember.vue', () => ({
  default: {
    name: 'DialogFormAboutTeamMember',
    template: '<div data-testid="dialog-form-about-team-member">Dialog Form About Team Member</div>',
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

describe('AboutTeamMembersManager', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const mountComponent = (permission: IResPermission) => {
    wrapper = mount(AboutTeamMembersManager, {
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

  test('fetches team members on mount then renders empty state', async () => {
    vi.mocked(listAboutTeamMembers).mockResolvedValue({
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

    expect(listAboutTeamMembers).toHaveBeenCalledTimes(1);
    expect(listAboutTeamMembers).toHaveBeenCalledWith(undefined);
    expect(wrapper.text()).toContain('No Data');
    expect(wrapper.find('[data-testid="add-about-team-member-btn"]').exists()).toBe(true);
  });

  test('renders mobile empty state without table when smAndDown', async () => {
    if (displayState.smAndDown) displayState.smAndDown.value = true;

    vi.mocked(listAboutTeamMembers).mockResolvedValue({
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
    vi.mocked(listAboutTeamMembers).mockResolvedValue({
      data: {
        success: true,
        count: 2,
        data: [
          {
            id: 11,
            member_id: 1,
            role: 'Coach',
            is_published: true,
            display_order: 1,
            member: { id: 1, name: 'Member 1', username: 'm1' },
          },
          {
            id: 12,
            member_id: 2,
            role: 'Staff',
            is_published: false,
            display_order: 2,
            member: { id: 2, name: 'Member 2', username: 'm2' },
          },
        ],
      },
    } as AxiosResponse);

    vi.mocked(sortAboutTeamMembers).mockResolvedValue({
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

    const updateSortBtn = wrapper.find('[data-testid="update-sort-about-team-member-btn"]');
    expect(updateSortBtn.exists()).toBe(true);
    await updateSortBtn.trigger('click');
    await flushPromises();

    expect(sortAboutTeamMembers).toHaveBeenCalledWith({ ids: ['11', '12'] });
  });

  test('confirm delete calls delete service when confirmed', async () => {
    vi.mocked(listAboutTeamMembers).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(deleteAboutTeamMember).mockResolvedValue({
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

    expect(deleteAboutTeamMember).toHaveBeenCalledWith(99);
  });
});

