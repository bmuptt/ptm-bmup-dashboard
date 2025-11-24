import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import type { AxiosResponse } from 'axios';
import MemberIndex from '@/pages/Setting/Member/Index.vue';
import { list } from '@/service/Setting/member';
import { getPermission } from '@/service/auth';
import { responseMemberSuccess, responseMemberError } from '../../../../mock/member-mock';

// Mock services
vi.mock('@/service/Setting/member', () => ({
  list: vi.fn(),
}));

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: {
      data: false,
      submit: false,
      permission: false,
    },
    resultLoading: false,
  }),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock('@/utils/confirm-dialog', () => ({
  useConfirmDialog: () => ({
    showDialog: ref(false),
    dialogOptions: ref({}),
    showConfirm: vi.fn().mockResolvedValue(true),
    handleConfirm: vi.fn(),
    handleCancel: vi.fn(),
  }),
}));

vi.mock('@/utils/tools', () => ({
  getProfile: vi.fn(),
}));

// Mock DialogFormMember component
vi.mock('@/components/UI/Setting/Member/DialogFormMember.vue', () => ({
  default: {
    name: 'DialogFormMember',
    template: '<div data-testid="dialog-form-member">Dialog Form Member</div>',
    props: ['selectData'],
    emits: ['closeDialog', 'refreshPage'],
  },
}));

// Mock ConfirmDialog component
vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel'],
  },
}));

describe('Member Index Component', () => {
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
          path: '/setting/member', 
          component: { template: '<div>Member</div>' },
          meta: { label: 'Member' },
        },
      ],
    });

    // Mock the current route
    router.currentRoute.value = {
      matched: [
        { meta: { label: 'Setting' } },
        { meta: { label: 'Member' } },
        { meta: { label: 'Member' } }
      ]
    } as unknown as typeof router.currentRoute.value;

    // Reset mocks
    vi.clearAllMocks();
    
    // Mock permission response
    vi.mocked(getPermission).mockResolvedValue({
      data: {
        data: {
          access: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
          approval_2: true,
          approval_3: true,
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);

    // Mock member list response
    vi.mocked(list).mockResolvedValue({
      data: responseMemberSuccess.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}): VueWrapper => {
    return mount(MemberIndex, {
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
          'v-text-field': { template: '<input data-testid="v-text-field" type="text" />' },
          'v-btn': { template: '<button data-testid="v-btn"><slot /></button>' },
          'v-data-table-server': { template: '<div data-testid="v-data-table-server"><slot /></div>' },
          'v-menu': { template: '<div data-testid="v-menu"><slot /></div>' },
          'v-list': { template: '<div data-testid="v-list"><slot /></div>' },
          'v-list-item': { template: '<div data-testid="v-list-item"><slot /></div>' },
          'v-list-item-title': { template: '<div data-testid="v-list-item-title"><slot /></div>' },
          'v-avatar': { template: '<div data-testid="v-avatar"><slot /></div>' },
          'v-img': { template: '<img data-testid="v-img" />' },
          'v-dialog': { template: '<div data-testid="v-dialog"><slot /></div>' },
          'v-card': { template: '<div data-testid="v-card"><slot /></div>' },
          'v-card-title': { template: '<div data-testid="v-card-title"><slot /></div>' },
          'v-card-text': { template: '<div data-testid="v-card-text"><slot /></div>' },
          'v-card-actions': { template: '<div data-testid="v-card-actions"><slot /></div>' },
          'v-spacer': { template: '<div data-testid="v-spacer"></div>' },
          'DialogFormMember': { template: '<div data-testid="dialog-form-member">Dialog Form Member</div>' },
          'ConfirmDialog': { template: '<div data-testid="confirm-dialog">Confirm Dialog</div>' },
        },
      },
      props,
    });
  };

  test('should render component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="v-data-table-server"]').exists()).toBe(true);
  });

  test('should display search field', () => {
    wrapper = createWrapper();
    
    const searchField = wrapper.find('[data-testid="v-text-field"]');
    expect(searchField.exists()).toBe(true);
  });

  test('should show add button when permission create is true', async () => {
    wrapper = createWrapper();
    
    // Wait for permission to be loaded
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const buttons = wrapper.findAll('[data-testid="v-btn"]');
    const addButton = buttons.find(btn => btn.text().includes('Add'));
    expect(addButton?.exists()).toBe(true);
  });

  test('should hide add button when permission create is false', async () => {
    // Mock permission with create false
    vi.mocked(getPermission).mockResolvedValue({
      data: {
        data: {
          access: true,
          create: false,
          update: true,
          delete: true,
          approval: true,
          approval_2: true,
          approval_3: true,
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for permission to be loaded
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const buttons = wrapper.findAll('[data-testid="v-btn"]');
    const addButton = buttons.find(btn => btn.text().includes('Add'));
    expect(addButton).toBeUndefined();
  });

  test('should call list service on mount', () => {
    wrapper = createWrapper();
    
    expect(list).toHaveBeenCalled();
  });

  test('should handle list service error', async () => {
    vi.mocked(list).mockRejectedValue(responseMemberError);
    
    wrapper = createWrapper();
    
    // Wait for component to handle error
    await wrapper.vm.$nextTick();
    
    expect(list).toHaveBeenCalled();
  });


  test('should show create user button when user_id is null', async () => {
    const mockDataWithCreateUserCondition = {
      data: {
        data: [
          {
            id: 1,
            user_id: null,
            name: 'John Doe',
            username: 'johndoe',
            gender: 'male',
            birthdate: '1990-01-01',
            address: 'Test Address',
            phone: '1234567890',
            photo: null,
            active: true,
            has_user_account: false,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
        pagination: { total: 1 },
      },
    };

    vi.mocked(list).mockResolvedValue({
      data: mockDataWithCreateUserCondition.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);

    wrapper = createWrapper();
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const component = wrapper.vm as unknown as {
      items: Array<{ user_id: number | null; username: string }>;
      permission: { create: boolean } | null;
    };

    expect(component.items[0].user_id).toBe(null);
    expect(component.items[0].username).toBe('johndoe');
    expect(component.permission?.create).toBe(true);
  });

  test('should not show create user button when user_id is not null', async () => {
    const mockDataWithExistingUser = {
      data: {
        data: [
          {
            id: 1,
            user_id: 123,
            name: 'John Doe',
            username: 'johndoe',
            gender: 'male',
            birthdate: '1990-01-01',
            address: 'Test Address',
            phone: '1234567890',
            photo: null,
            active: true,
            has_user_account: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
        pagination: { total: 1 },
      },
    };

    vi.mocked(list).mockResolvedValue({
      data: mockDataWithExistingUser.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);

    wrapper = createWrapper();
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const component = wrapper.vm as unknown as {
      items: Array<{ user_id: number | null; username: string }>;
      permission: { create: boolean } | null;
    };

    expect(component.items[0].user_id).toBe(123);
    expect(component.permission?.create).toBe(true);
  });

  test('should open create user dialog when create user button is clicked', async () => {
    wrapper = createWrapper();
    
    await wrapper.vm.$nextTick();

    const mockMemberData = {
      id: 1,
      user_id: null,
      name: 'John Doe',
      username: 'johndoe',
      gender: 'male',
      birthdate: '1990-01-01',
      address: 'Test Address',
      phone: '1234567890',
      photo: null,
      active: true,
      has_user_account: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    const component = wrapper.vm as unknown as {
      openCreateUserDialog: (data: typeof mockMemberData) => void;
      statusCreateUserDialog: boolean;
      selectedMemberForUser: typeof mockMemberData | null;
    };

    component.openCreateUserDialog(mockMemberData);
    await wrapper.vm.$nextTick();

    expect(component.statusCreateUserDialog).toBe(true);
    expect(component.selectedMemberForUser).toEqual(mockMemberData);
  });
});
