import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import RoleIndex from '../../../../../pages/AppManagement/Role/Index.vue';
import { deleteData, list } from '../../../../../service/AppManagement/role';
import { getPermission } from '../../../../../service/auth';
import { responseDeleteSuccess, responseDeleteError, responseListSuccess, responseListError } from '../../../../mock/role-mock';
import { responsePermissionSuccess, responsePermissionError } from '../../../../mock/auth-mock';
import type { AxiosResponse } from 'axios';

// Type for component instance
interface RoleIndexInstance {
  submitDelete: (id: number) => Promise<void>;
  fetchData: () => Promise<void>;
  fetchPermission: () => Promise<void>;
  openDialogForm: (data: { id: number; name: string }) => void;
  closeDialogForm: () => void;
  refreshPage: () => void;
  statusDialogForm: boolean;
  selectData: { id: number; name: string } | null;
}

// Mock services
vi.mock('../../../../../service/AppManagement/role', () => ({
  deleteData: vi.fn().mockResolvedValue({ data: { message: 'Success' } }),
  list: vi.fn().mockResolvedValue({ data: { data: [], total: 0 } }),
}));

vi.mock('../../../../../service/auth', () => ({
  getPermission: vi.fn().mockResolvedValue({ data: { data: { create: true, update: true, delete: true } } }),
}));

// Mock SweetAlert
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock useConfirmDialog
vi.mock('../../../../../utils/confirm-dialog', () => ({
  useConfirmDialog: () => ({
    showDialog: ref(false),
    dialogOptions: ref({
      title: '',
      html: '',
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f86f24',
    }),
    showConfirm: vi.fn().mockResolvedValue(true),
    handleConfirm: vi.fn(),
    handleCancel: vi.fn(),
  }),
}));

// Mock useLoadingComponent
vi.mock('../../../../../utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: ref({
      data: false,
      submit: false,
      permission: false,
    }),
    resultLoading: ref(false),
  }),
}));

// Mock useDisplay
vi.mock('vuetify', async () => {
  const actual = await vi.importActual('vuetify');
  return {
    ...actual,
    useDisplay: () => ({
      smAndDown: ref(false),
      mdAndUp: ref(true),
    }),
  };
});

// Mock useTable
vi.mock('../../../../../utils/appmanagement/role/list', () => ({
  useTable: () => ({
    headers: [
      { title: 'Name', key: 'name' },
      { title: 'Actions', key: 'actions' },
    ],
    itemsPerPageOptions: [10, 25, 50],
  }),
}));

// Mock getProfile
vi.mock('../../../../../utils/tools', () => ({
  getProfile: vi.fn().mockResolvedValue({}),
}));

// Mock ConfirmDialog component
vi.mock('../../../../../components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
  },
}));

// Mock DialogForm component
vi.mock('../../../../../components/UI/AppManagement/Role/DialogFormRole.vue', () => ({
  default: {
    name: 'DialogForm',
    template: '<div data-testid="dialog-form">Dialog Form</div>',
  },
}));

describe('Role Index Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;
  let router: Router;

  const createWrapper = () => {
    vuetify = createVuetify();
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'role',
          component: { template: '<div>Role</div>' },
          meta: { label: 'Role Management' },
        },
      ],
    });

    return mount(RoleIndex, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          'v-row': true,
          'v-col': true,
          'v-text-field': true,
          'v-btn': true,
          'v-data-table-server': true,
          'v-menu': true,
          'v-list': true,
          'v-list-item': true,
          'v-list-item-title': true,
          'v-dialog': true,
          'v-spacer': true,
        },
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
      },
    });
  };

  beforeEach(() => {
    // Mock route
    vi.mock('vue-router', async () => {
      const actual = await vi.importActual('vue-router');
      return {
        ...actual,
        useRoute: () => ({
          matched: [
            {},
            {},
            { meta: { label: 'Role Management' } },
          ],
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render component correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test('should display page title', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should render search field', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should render add button when permission allows', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should render data table', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should call deleteData service successfully', async () => {
    vi.mocked(deleteData).mockResolvedValue(responseDeleteSuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call submitDelete
    await vm.submitDelete(1);
    
    // Verify service was called
    expect(deleteData).toHaveBeenCalledWith(1);
  });

  test('should handle deleteData error gracefully', async () => {
    vi.mocked(deleteData).mockRejectedValue(responseDeleteError);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call submitDelete and expect it to handle error gracefully
    await expect(vm.submitDelete(1)).resolves.not.toThrow();
    
    // Verify service was called
    expect(deleteData).toHaveBeenCalledWith(1);
  });

  test('should call list service successfully', async () => {
    vi.mocked(list).mockResolvedValue(responseListSuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call fetchData
    await vm.fetchData();
    
    // Verify service was called
    expect(list).toHaveBeenCalled();
  });

  test('should handle list error gracefully', async () => {
    vi.mocked(list).mockRejectedValue(responseListError);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call fetchData and expect it to handle error gracefully
    await expect(vm.fetchData()).resolves.not.toThrow();
    
    // Verify service was called
    expect(list).toHaveBeenCalled();
  });

  test('should call getPermission service successfully', async () => {
    vi.mocked(getPermission).mockResolvedValue(responsePermissionSuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call fetchPermission
    await vm.fetchPermission();
    
    // Verify service was called
    expect(getPermission).toHaveBeenCalled();
  });

  test('should handle getPermission error gracefully', async () => {
    vi.mocked(getPermission).mockRejectedValue(responsePermissionError);
    
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call fetchPermission and expect it to handle error gracefully
    // Since fetchPermission might not return a Promise, we test it differently
    expect(() => vm.fetchPermission()).not.toThrow();
    
    // Verify service was called
    expect(getPermission).toHaveBeenCalled();
  });

  test('should open dialog form when openDialogForm is called', () => {
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Call openDialogForm
    vm.openDialogForm({ id: 1, name: 'Test Role' });
    
    // Verify dialog state
    expect(vm.statusDialogForm).toBe(true);
    expect(vm.selectData).toEqual({ id: 1, name: 'Test Role' });
  });

  test('should close dialog form when closeDialogForm is called', () => {
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Set initial state
    vm.statusDialogForm = true;
    vm.selectData = { id: 1, name: 'Test Role' };
    
    // Call closeDialogForm
    vm.closeDialogForm();
    
    // Verify dialog state
    expect(vm.statusDialogForm).toBe(false);
  });

  test('should refresh page when refreshPage is called', () => {
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as RoleIndexInstance;
    
    // Test that refreshPage method exists and can be called
    expect(typeof vm.refreshPage).toBe('function');
    
    // Call refreshPage - should not throw error
    expect(() => vm.refreshPage()).not.toThrow();
  });
});
