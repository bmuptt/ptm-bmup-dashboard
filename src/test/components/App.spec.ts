import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import App from '../../App.vue';
import { getCoreSetting } from '../../service/Setting/core';
import { responseCoreSettingSuccess } from '../mock/core-mock';
import type { AxiosResponse } from 'axios';
import type { ICoreSetting } from '@/model/core-setting-interface';

// Mock services
vi.mock('@/service/Setting/core', () => ({
  getCoreSetting: vi.fn(() => Promise.resolve(responseCoreSettingSuccess)),
}));

// Mock stores
const mockStore = {
  coreSetting: null as ICoreSetting | null,
  addCoreSetting: vi.fn(),
};

vi.mock('@/stores/app', () => ({
  useAppStore: vi.fn(() => mockStore),
}));

describe('App Component', () => {
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
              primary: '#1976D2', // Default Vuetify primary color
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
    return mount(App, {
      global: {
        plugins: [vuetify, router],
        provide: {},
        stubs: {
          'router-view': { template: '<div data-testid="router-view">Router View</div>' },
        },
      },
      props,
    });
  };

  test('should render App component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true);
  });

  test('should call getCoreSetting on mount', async () => {
    wrapper = createWrapper();
    
    // Wait for component to mount and call getCoreSetting
    await wrapper.vm.$nextTick();
    
    expect(getCoreSetting).toHaveBeenCalled();
  });

  test('should update store with core setting data', async () => {
    vi.mocked(getCoreSetting).mockResolvedValue(responseCoreSettingSuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for component to mount and call getCoreSetting
    await wrapper.vm.$nextTick();
    
    expect(mockStore.addCoreSetting).toHaveBeenCalledWith(responseCoreSettingSuccess.data.data);
  });

  test('should update Vuetify theme primary color when core setting has primary_color', async () => {
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
    
    wrapper = createWrapper();
    
    // Wait for component to mount and call getCoreSetting
    await wrapper.vm.$nextTick();
    
    expect(vuetify.theme.themes.value.customTheme.colors.primary).toBe('#f86f24');
  });

  test('should not update Vuetify theme when core setting has no primary_color', async () => {
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
    
    wrapper = createWrapper();
    
    // Wait for component to mount and call getCoreSetting
    await wrapper.vm.$nextTick();
    
    // Should remain default color
    expect(vuetify.theme.themes.value.customTheme.colors.primary).toBe('#1976D2');
  });

  test('should handle getCoreSetting error gracefully', async () => {
    const errorResponse = {
      response: {
        data: { message: 'Error occurred' },
        status: 500,
      },
    };
    
    vi.mocked(getCoreSetting).mockRejectedValue(errorResponse);
    
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    wrapper = createWrapper();
    
    // Wait for component to mount and call getCoreSetting
    await wrapper.vm.$nextTick();
    
    // Wait a bit more for the promise to resolve
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching core setting:', errorResponse);
    
    consoleSpy.mockRestore();
  });


  test('should not update Vuetify theme when store core setting has no primary_color', async () => {
    wrapper = createWrapper();
    
    // Mock core setting without primary color
    const coreSettingWithoutColor = {
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
    };

    // Update store with core setting without primary color
    mockStore.coreSetting = coreSettingWithoutColor;
    
    // Trigger the watcher
    await wrapper.vm.$nextTick();
    
    // Check if Vuetify theme primary color remains default
    expect(vuetify.theme.themes.value.customTheme.colors.primary).toBe('#1976D2');
  });
});
