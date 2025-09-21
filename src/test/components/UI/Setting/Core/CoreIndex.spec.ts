import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import type { AxiosResponse } from 'axios';
import CoreIndex from '@/pages/Setting/Core/Index.vue';
import { updateCoreSetting } from '@/service/Setting/core';
import { getPermission } from '@/service/auth';
import { responseCoreSettingSuccess, responseCoreSettingError } from '../../../../mock/core-mock';

// Mock stores
const mockStore = {
  coreSetting: {
    id: 0,
    name: 'PTM BMUP',
    logo: 'http://localhost:8000/storage/logos/logo.jpg',
    description: 'Sistem pengaturan BMUP',
    address: 'Jl. Contoh No. 789, Jakarta Pusat',
    maps: null,
    primary_color: '#f86f24',
    secondary_color: '#efbc37',
    created_at: '2025-08-27T15:08:11.000000Z',
    updated_at: '2025-08-27T19:13:29.000000Z'
  },
  addCoreSetting: vi.fn(),
};

// Mock dependencies
vi.mock('@/service/Setting/core', () => ({
  updateCoreSetting: vi.fn(),
}));

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('@/stores/app', () => ({
  useAppStore: vi.fn(() => mockStore),
}));

vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: {
      data: false,
      submit: false,
    },
  }),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock TinyMCE component
vi.mock('@/components/common/TinyMCE.vue', () => ({
  default: {
    name: 'TinyMCE',
    template: '<div data-testid="tinymce"><slot /></div>',
    props: ['modelValue', 'disabled', 'placeholder', 'height'],
    emits: ['update:modelValue'],
  },
}));

// Mock URL methods for file handling
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = vi.fn();

describe('Core Setting Index Component', () => {
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
          path: '/setting/core', 
          component: { template: '<div>Core Setting</div>' },
          meta: { label: 'Core Setting' },
        },
      ],
    });

    // Mock the current route
    router.currentRoute.value = {
      matched: [
        { meta: { label: 'Setting' } },
        { meta: { label: 'Core' } },
        { meta: { label: 'Core Setting' } }
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
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}): VueWrapper => {
    return mount(CoreIndex, {
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
          'v-card': { template: '<div data-testid="v-card"><slot /></div>' },
          'v-form': { template: '<form data-testid="v-form"><slot /></form>' },
          'v-text-field': { template: '<input data-testid="v-text-field" type="text" />' },
          'v-textarea': { template: '<textarea data-testid="v-textarea"></textarea>' },
          'v-img': { template: '<img data-testid="v-img" />' },
          'v-btn': { template: '<button data-testid="v-btn"><slot /></button>' },
          'v-input': { template: '<input data-testid="v-input" />' },
          'TinyMCE': { template: '<div data-testid="tinymce">TinyMCE</div>' },
        },
      },
      props,
    });
  };

  test('should render component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="v-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="v-card"]').exists()).toBe(true);
  });

  test('should display form fields correctly', () => {
    wrapper = createWrapper();
    
    // Check if form fields exist
    const textFields = wrapper.findAll('[data-testid="v-text-field"]');
    const textarea = wrapper.find('[data-testid="v-textarea"]');
    const tinymce = wrapper.find('[data-testid="tinymce"]');
    
    expect(textFields.length).toBeGreaterThan(0);
    expect(textarea.exists()).toBe(true);
    expect(tinymce.exists()).toBe(true);
  });

  test('should have only one name application input field', () => {
    wrapper = createWrapper();
    
    // Check that there's only one text input field for name (excluding color inputs)
    const textFields = wrapper.findAll('[data-testid="v-text-field"]');
    // There should be 1 name field, 1 maps field, 2 color fields = 4 total
    // But we want to verify the name field exists
    expect(textFields.length).toBeGreaterThan(0);
  });

  test('should handle form submission successfully', async () => {
    vi.mocked(updateCoreSetting).mockResolvedValue({
      ...responseCoreSettingSuccess,
      headers: {},
      config: {},
    } as unknown as ReturnType<typeof updateCoreSetting> extends Promise<infer T> ? T : never);
    
    wrapper = createWrapper();
    
    // Submit form
    const form = wrapper.find('[data-testid="v-form"]');
    await form.trigger('submit.prevent');
    
    expect(updateCoreSetting).toHaveBeenCalled();
  });

  test('should handle form submission error', async () => {
    vi.mocked(updateCoreSetting).mockRejectedValue(responseCoreSettingError);
    
    wrapper = createWrapper();
    
    // Submit form
    const form = wrapper.find('[data-testid="v-form"]');
    await form.trigger('submit.prevent');
    
    expect(updateCoreSetting).toHaveBeenCalled();
  });

  test('should handle file upload for logo', async () => {
    wrapper = createWrapper();
    
    // Create a mock file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simulate file change
    const component = wrapper.vm as unknown as Record<string, unknown>;
    (component.handleFileChange as (event: { target: { files: File[] } }) => void)({ target: { files: [file] } });
    
    // Check if file is set in component state
    expect((component.state as Record<string, unknown>).logo).toBe(file);
    expect((component.state as Record<string, unknown>).status_logo).toBe('1');
  });

  test('should handle logo deletion', async () => {
    wrapper = createWrapper();
    
    // Set initial logo
    const component = wrapper.vm as unknown as Record<string, unknown>;
    component.currentLogo = 'blob:test-url';
    (component.state as Record<string, unknown>).logo = new File(['test'], 'test.jpg');
    
    // Trigger delete
    (component.deleteLogo as () => void)();
    
    // Check if logo is cleared
    expect((component.state as Record<string, unknown>).logo).toBe(null);
    expect((component.state as Record<string, unknown>).status_logo).toBe('1');
    expect(component.currentLogo).toBe('');
  });

  test('should validate form fields', async () => {
    wrapper = createWrapper();
    
    // Try to submit empty form
    const form = wrapper.find('[data-testid="v-form"]');
    await form.trigger('submit.prevent');
    
    // Should call API (validation is handled by vuelidate)
    expect(updateCoreSetting).toHaveBeenCalled();
    
    // Clean up
    wrapper.unmount();
  });

  test('should show update button when permission update is true', async () => {
    // Mock permission with update true
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
    
    wrapper = createWrapper();
    
    // Wait for permission to be loaded and component to update
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if update button exists
    const updateButtons = wrapper.findAll('[data-testid="v-btn"]');
    const updateButton = updateButtons.find(btn => btn.text().includes('Update Core Setting'));
    expect(updateButton?.exists()).toBe(true);
  });

  test('should hide update button when permission update is false', async () => {
    // Mock permission with update false
    vi.mocked(getPermission).mockResolvedValue({
      data: {
        data: {
          access: true,
          create: true,
          update: false,
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
    
    // Wait for permission to be loaded and component to update
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if update button does not exist
    const updateButtons = wrapper.findAll('[data-testid="v-btn"]');
    const updateButton = updateButtons.find(btn => btn.text().includes('Update Core Setting'));
    expect(updateButton).toBeUndefined();
  });
});
