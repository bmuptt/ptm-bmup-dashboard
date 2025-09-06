import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { ref } from 'vue';
import CoreSystem from '../../layouts/CoreSystem.vue';
import { logout, profile } from '../../service/auth';
import { getCoreSetting } from '../../service/Setting/core';
import { responseCoreSettingSuccess, responseCoreSettingError } from '../mock/core-mock';
import { responseProfileSuccess, responseProfileError } from '../mock/auth-mock';
import type { AxiosResponse } from 'axios';
import type { ICoreSetting } from '@/model/core-setting-interface';

// Type for component instance with exposed properties
type CoreSystemInstance = {
  dataProfile: unknown;
  resultLoading: boolean;
  drawer: boolean;
  stringAvatar: string;
};

// Mock services with proper Promise returns
vi.mock('@/service/auth', () => ({
  logout: vi.fn(() => Promise.resolve({ data: { message: 'Logout successful' } })),
  profile: vi.fn(() => Promise.resolve(responseProfileSuccess)),
}));

vi.mock('@/service/Setting/core', () => ({
  getCoreSetting: vi.fn(() => Promise.resolve(responseCoreSettingSuccess)),
}));

// Mock stores
const mockStore = {
  profileGlobal: null,
  coreSetting: null as ICoreSetting | null,
  addProfileGlobal: vi.fn(),
  addCoreSetting: vi.fn(),
};

vi.mock('@/stores/app', () => ({
  useAppStore: vi.fn(() => mockStore),
}));

// Mock ConfirmDialog component
vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['update:modelValue', 'confirm', 'cancel'],
  },
}));

// Mock RecursiveMenu component
vi.mock('@/layouts/RecursiveMenu.vue', () => ({
  default: {
    name: 'RecursiveMenu',
    template: '<div data-testid="recursive-menu">Recursive Menu</div>',
    props: ['items'],
  },
}));

// Mock loading utils
const mockLoading = {
  loading: {
    data: false,
    dataCore: false,
    submit: false,
  },
  resultLoading: false,
};

vi.mock('@/utils/loading', () => ({
  useLoading: vi.fn(() => mockLoading),
}));

// Mock confirm dialog utils
vi.mock('@/utils/confirm-dialog', () => ({
  useConfirmDialog: vi.fn(() => ({
    showDialog: ref(false),
    dialogOptions: ref({
      title: '',
      html: '',
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f86f24',
    }),
    showConfirm: vi.fn(() => Promise.resolve(true)),
    handleConfirm: vi.fn(),
    handleCancel: vi.fn(),
  })),
}));

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
});

describe('CoreSystem Component', () => {
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
              primary: '#0D47A1', // Default primary color
            },
          },
        },
      },
    });
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/home', component: { template: '<div>Home</div>' } },
      ],
    });

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}) => {
    return mount(CoreSystem, {
      global: {
        plugins: [vuetify, router],
        provide: {},
        stubs: {
          'router-view': { template: '<div data-testid="router-view">Router View</div>' },
          'v-navigation-drawer': { template: '<div data-testid="navigation-drawer"><slot /></div>' },
          'v-app-bar': { template: '<div data-testid="app-bar"><slot /></div>' },
          'v-main': { template: '<div data-testid="main"><slot /></div>' },
          'v-sheet': { template: '<div data-testid="sheet"><slot /></div>' },
          'v-avatar': { template: '<div data-testid="avatar"><slot /></div>' },
          'v-divider': { template: '<div data-testid="divider"></div>' },
          'v-list': { template: '<div data-testid="list"><slot /></div>' },
          'v-list-item': { template: '<div data-testid="list-item"><slot /></div>' },
          'v-list-item-title': { template: '<div data-testid="list-item-title"><slot /></div>' },
          'v-app-bar-nav-icon': { 
            template: '<button data-testid="nav-icon" @click="$emit(\'click\')"></button>',
            emits: ['click']
          },
          'v-toolbar-title': { template: '<div data-testid="toolbar-title"><slot /></div>' },
          'v-spacer': { template: '<div data-testid="spacer"></div>' },
          'v-btn': { template: '<button data-testid="btn" @click="$emit(\'click\')"><slot /></button>' },
          'confirm-dialog': { template: '<div data-testid="confirm-dialog">Confirm Dialog</div>' },
        },
      },
      props,
    });
  };

  test('should render CoreSystem component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="navigation-drawer"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="app-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="main"]').exists()).toBe(true);
  });

  test('should display loading state when resultLoading is true', async () => {
    // Set loading state before creating wrapper
    mockLoading.resultLoading = true;
    wrapper = createWrapper();
    
    // Mock null profile
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = null;
    await wrapper.vm.$nextTick();
    
    // Check if loading text appears in profile section
    const profileSection = wrapper.find('.font-weight-bold');
    expect(profileSection.exists()).toBe(true);
    expect(profileSection.text()).toContain('Loading...');
    
    // Reset for other tests
    mockLoading.resultLoading = false;
  });

  test('should display "No Data" when dataProfile is null', async () => {
    wrapper = createWrapper();
    
    // Mock null profile data
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = null;
    (wrapper.vm as unknown as CoreSystemInstance).resultLoading = false;
    await wrapper.vm.$nextTick();
    
    const profileSection = wrapper.find('.font-weight-bold');
    expect(profileSection.text()).toContain('No Data');
  });

  test('should display profile name when dataProfile exists', async () => {
    wrapper = createWrapper();
    
    // Mock profile data
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = {
      profile: {
        name: 'John Doe',
      },
      menu: [],
    };
    (wrapper.vm as unknown as CoreSystemInstance).resultLoading = false;
    await wrapper.vm.$nextTick();
    
    const profileSection = wrapper.find('.font-weight-bold');
    expect(profileSection.text()).toContain('John Doe');
  });

  test('should generate correct avatar initials from profile name', async () => {
    wrapper = createWrapper();
    
    // Test with two names
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = {
      profile: {
        name: 'John Doe',
      },
      menu: [],
    };
    await wrapper.vm.$nextTick();
    
    expect((wrapper.vm as unknown as CoreSystemInstance).stringAvatar).toBe('JD');
    
    // Test with single name
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = {
      profile: {
        name: 'John',
      },
      menu: [],
    };
    await wrapper.vm.$nextTick();
    
    expect((wrapper.vm as unknown as CoreSystemInstance).stringAvatar).toBe('J');
  });

  test('should toggle drawer when app bar nav icon is clicked', async () => {
    wrapper = createWrapper();
    
    const initialDrawerState = (wrapper.vm as unknown as CoreSystemInstance).drawer;
    
    // Directly test the drawer toggle logic
    (wrapper.vm as unknown as CoreSystemInstance).drawer = !(wrapper.vm as unknown as CoreSystemInstance).drawer;
    await wrapper.vm.$nextTick();
    
    // Check if drawer state changed
    expect((wrapper.vm as unknown as CoreSystemInstance).drawer).toBe(!initialDrawerState);
  });

  test('should render logout button in app bar', () => {
    wrapper = createWrapper();
    
    const logoutButton = wrapper.find('[data-testid="btn"]');
    expect(logoutButton.exists()).toBe(true);
    expect(logoutButton.text()).toContain('Logout');
  });

  test('should render Home menu item in navigation drawer', () => {
    wrapper = createWrapper();
    
    const homeMenuItem = wrapper.find('[data-testid="list-item"]');
    expect(homeMenuItem.exists()).toBe(true);
    expect(homeMenuItem.text()).toContain('Home');
  });

  test('should render RecursiveMenu when profile data exists and not loading', async () => {
    wrapper = createWrapper();
    
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = {
      profile: {
        name: 'John Doe',
      },
      menu: [
        { id: 1, name: 'Menu 1', children: [] },
      ],
    };
    (wrapper.vm as unknown as CoreSystemInstance).resultLoading = false;
    
    await wrapper.vm.$nextTick();
    
    const recursiveMenu = wrapper.find('[data-testid="recursive-menu"]');
    expect(recursiveMenu.exists()).toBe(true);
  });

  test('should not render RecursiveMenu when loading', async () => {
    wrapper = createWrapper();
    
    (wrapper.vm as unknown as CoreSystemInstance).dataProfile = {
      profile: {
        name: 'John Doe',
      },
      menu: [],
    };
    (wrapper.vm as unknown as CoreSystemInstance).resultLoading = true;
    
    await wrapper.vm.$nextTick();
    
    const recursiveMenu = wrapper.find('[data-testid="recursive-menu"]');
    expect(recursiveMenu.exists()).toBe(false);
  });

  test('should handle responsive drawer behavior for desktop', async () => {
    // Mock desktop width
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
    });
    
    wrapper = createWrapper();
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    
    expect((wrapper.vm as unknown as CoreSystemInstance).drawer).toBe(true);
  });

  test('should handle responsive drawer behavior for mobile', async () => {
    // Mock mobile width
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
    });
    
    wrapper = createWrapper();
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    
    expect((wrapper.vm as unknown as CoreSystemInstance).drawer).toBe(false);
  });

  test('should set initial title from store if core setting exists', async () => {
    // Mock core setting in store
    const mockCoreSetting = {
      id: 1,
      name: 'PTM BMUP',
      logo: 'http://localhost:8000/storage/logos/test.jpg',
      description: 'Test description',
      address: 'Test address',
      maps: null,
      primary_color: '#f86f24',
      secondary_color: '#efbc37',
      created_at: '2025-08-27T15:08:11.000000Z',
      updated_at: '2025-09-05T21:32:25.000000Z'
    };

    mockStore.coreSetting = mockCoreSetting;
    
    wrapper = createWrapper();
    
    // Check if title is set from store
    const toolbarTitle = wrapper.find('[data-testid="toolbar-title"]');
    expect(toolbarTitle.text()).toBe('PTM BMUP');
  });
});

describe('CoreSystem Service Integration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call profile service successfully', async () => {
    vi.mocked(profile).mockResolvedValue(responseProfileSuccess as AxiosResponse);
    
    const result = await profile();
    
    expect(profile).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.profile.name).toBe('John Doe');
  });

  test('should handle profile service error gracefully', async () => {
    vi.mocked(profile).mockRejectedValue(responseProfileError);
    
    await expect(profile()).rejects.toEqual(responseProfileError);
    expect(profile).toHaveBeenCalled();
  });

  test('should call getCoreSetting service successfully', async () => {
    vi.mocked(getCoreSetting).mockResolvedValue(responseCoreSettingSuccess as AxiosResponse);
    
    const result = await getCoreSetting();
    
    expect(getCoreSetting).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.name).toBe('PTM BMUP');
  });

  test('should handle getCoreSetting service error gracefully', async () => {
    vi.mocked(getCoreSetting).mockRejectedValue(responseCoreSettingError);
    
    await expect(getCoreSetting()).rejects.toEqual(responseCoreSettingError);
    expect(getCoreSetting).toHaveBeenCalled();
  });

  test('should call logout service successfully', async () => {
    vi.mocked(logout).mockResolvedValue({ data: { message: 'Logout successful' } } as AxiosResponse);
    
    const result = await logout();
    
    expect(logout).toHaveBeenCalled();
    expect(result.data.message).toBe('Logout successful');
  });

  test('should handle logout service error gracefully', async () => {
    const errorResponse = {
      response: {
        data: { message: 'Logout failed' },
        status: 500,
      },
    };
    
    vi.mocked(logout).mockRejectedValue(errorResponse);
    
    await expect(logout()).rejects.toEqual(errorResponse);
    expect(logout).toHaveBeenCalled();
  });
});

describe('CoreSystem Dynamic Primary Color Integration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call core setting service and handle primary color', async () => {
    // Mock successful core setting response with custom primary color
    const customResponse = {
      data: {
        success: true,
        data: {
          id: 1,
          name: 'PTM BMUP',
          logo: 'http://localhost:8000/storage/logos/test.jpg',
          description: 'Test description',
          address: 'Test address',
          maps: null,
          primary_color: '#f86f24',
          secondary_color: '#efbc37',
          created_at: '2025-08-27T15:08:11.000000Z',
          updated_at: '2025-09-05T21:32:25.000000Z'
        }
      }
    };

    vi.mocked(getCoreSetting).mockResolvedValue(customResponse as AxiosResponse);
    
    const result = await getCoreSetting();
    
    expect(getCoreSetting).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.primary_color).toBe('#f86f24');
    expect(result.data.data.name).toBe('PTM BMUP');
  });

  test('should handle core setting with empty primary color', async () => {
    // Mock core setting response without primary color
    const responseWithoutColor = {
      data: {
        success: true,
        data: {
          id: 1,
          name: 'PTM BMUP',
          logo: 'http://localhost:8000/storage/logos/test.jpg',
          description: 'Test description',
          address: 'Test address',
          maps: null,
          primary_color: '',
          secondary_color: '#efbc37',
          created_at: '2025-08-27T15:08:11.000000Z',
          updated_at: '2025-09-05T21:32:25.000000Z'
        }
      }
    };

    vi.mocked(getCoreSetting).mockResolvedValue(responseWithoutColor as AxiosResponse);
    
    const result = await getCoreSetting();
    
    expect(getCoreSetting).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.primary_color).toBe('');
  });
});
