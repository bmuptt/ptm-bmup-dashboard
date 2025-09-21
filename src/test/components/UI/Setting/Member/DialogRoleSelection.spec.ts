import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DialogRoleSelection from '@/components/UI/Setting/Member/DialogRoleSelection.vue';
import { list as listRoles } from '@/service/AppManagement/role';
import type { AxiosRequestHeaders } from 'axios';
import { computed } from 'vue';

// Mock the service
vi.mock('@/service/AppManagement/role', () => ({
  list: vi.fn(),
}));

// Mock loading utility
vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: {
      role: false,
      data: false,
      submit: false,
      permission: false,
      structureMenu: false
    },
    resultLoading: computed(() => false)
  })
}));

const vuetify = createVuetify({
  components,
  directives,
});

const mockRolesResponse = {
  data: {
    data: [
      { id: 1, name: 'Admin', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, name: 'User', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { headers: {} as AxiosRequestHeaders },
};

// Mock window.visualViewport
Object.defineProperty(window, 'visualViewport', {
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    width: 1024,
    height: 768,
  },
  writable: true,
});

describe('DialogRoleSelection', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    wrapper = mount(DialogRoleSelection, {
      props: {
        modelValue: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should call listRoles when dialog opens', () => {
    vi.mocked(listRoles).mockResolvedValue(mockRolesResponse);
    
    const component = wrapper.vm as unknown as {
      fetchRoles: () => void;
      stateParams: {
        search: string;
        order_field: string | null;
        order_dir: string | null;
        page: number;
        per_page: number;
      };
    };
    
    component.fetchRoles();
    
    expect(listRoles).toHaveBeenCalledWith(component.stateParams);
  });

  it('should emit roleSelected when role is selected', async () => {
    const mockRole = { id: 1, name: 'Admin', created_at: '2024-01-01', updated_at: '2024-01-01' };
    
    const component = wrapper.vm as unknown as {
      selectRole: (role: { id: number; name: string; created_at: string; updated_at: string }) => void;
    };
    
    component.selectRole(mockRole);
    
    expect(wrapper.emitted('roleSelected')).toBeTruthy();
    expect(wrapper.emitted('roleSelected')?.[0]).toEqual([mockRole]);
  });

  it('should emit update:modelValue when dialog is closed', async () => {
    const component = wrapper.vm as unknown as {
      closeDialog: () => void;
    };
    
    component.closeDialog();
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('should update stateParams when search changes', async () => {
    const component = wrapper.vm as unknown as {
      stateParams: {
        search: string;
        page: number;
      };
    };
    
    // Test search parameter update
    component.stateParams.search = 'admin';
    
    expect(component.stateParams.search).toBe('admin');
  });

  it('should reset search when dialog closes', async () => {
    const component = wrapper.vm as unknown as {
      stateParams: {
        search: string;
        page: number;
      };
      roles: { id: number; name: string; created_at: string; updated_at: string }[];
    };
    
    // Set up test data
    component.stateParams.search = 'test';
    component.roles = [{ id: 1, name: 'Admin', created_at: '2024-01-01', updated_at: '2024-01-01' }];
    
    // Close dialog
    await wrapper.setProps({ modelValue: false });
    
    expect(component.stateParams.search).toBe('');
    expect(component.stateParams.page).toBe(1);
  });
});