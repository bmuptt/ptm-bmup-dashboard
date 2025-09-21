import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import TinyMCE from '../../../components/common/TinyMCE.vue';
import { getConfigKey } from '@/service/Setting/config';
import { responseConfigKeySuccess, responseConfigKeyNotConfigured, responseConfigKeyError } from '../../mock/config-mock';
import type { AxiosResponse } from 'axios';

// Mock TinyMCE Editor
vi.mock('@tinymce/tinymce-vue', () => ({
  default: {
    name: 'Editor',
    template: '<div data-testid="tinymce-editor">TinyMCE Editor</div>',
    props: ['apiKey', 'modelValue', 'init', 'disabled'],
    emits: ['update:modelValue'],
  },
}));

vi.mock('@/service/Setting/config', () => ({
  getConfigKey: vi.fn(),
}));



// Mock visualViewport for Vuetify compatibility
Object.defineProperty(window, 'visualViewport', {
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    width: 1024,
    height: 768,
  },
  writable: true,
});

// Mock matchMedia for Vuetify compatibility
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

const vuetify = createVuetify({
  components,
  directives,
});

const mockSwal = {
  fire: vi.fn(),
  close: vi.fn(),
};

describe('TinyMCE Component', () => {
  let wrapper: VueWrapper;

  const createWrapper = (props = {}) => {
    return mount(TinyMCE, {
      props: {
        modelValue: '',
        ...props,
      },
      global: {
        plugins: [vuetify],
        provide: { $swal: mockSwal },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock for getConfigKey
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render TinyMCE component correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test('should display TinyMCE editor when API key is configured', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    wrapper = createWrapper();
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
    
    const editor = wrapper.find('[data-testid="tinymce-editor"]');
    expect(editor.exists()).toBe(true);
  });

  test('should pass modelValue to editor', () => {
    const testValue = '<p>Test content</p>';
    wrapper = createWrapper({ modelValue: testValue });
    expect(wrapper.exists()).toBe(true);
  });

  test('should handle disabled state', () => {
    wrapper = createWrapper({ disabled: true });
    expect(wrapper.exists()).toBe(true);
  });

  test('should handle placeholder prop', () => {
    const placeholder = 'Custom placeholder';
    wrapper = createWrapper({ placeholder });
    expect(wrapper.exists()).toBe(true);
  });

  test('should handle height prop', () => {
    const height = 400;
    wrapper = createWrapper({ height });
    expect(wrapper.exists()).toBe(true);
  });

  test('should emit update:modelValue when content changes', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    wrapper = createWrapper();
    
    // Get component instance with proper typing
    const vm = wrapper.vm as unknown as { handleUpdate: (value: string) => void };
    
    // Simulate content change
    vm.handleUpdate('<p>New content</p>');
    
    // Check if emit was called
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>New content</p>']);
  });

  test('should fetch API key from backend on mount', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for onMounted to complete
    await wrapper.vm.$nextTick();
    
    expect(getConfigKey).toHaveBeenCalled();
  });

  test('should call getConfigKey on mount', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for onMounted to complete
    await wrapper.vm.$nextTick();
    
    expect(getConfigKey).toHaveBeenCalled();
  });

  test('should use API key from backend when configured', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
    
    // Check if the component received the API key
    const editorComponent = wrapper.findComponent({ name: 'Editor' });
    expect(editorComponent.props('apiKey')).toBe('a1idauizyuf1o8yisl59r9fghhf2aejxwp0y9udswha8n5hg');
  });

  test('should not display editor when TinyMCE is not configured', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeyNotConfigured as AxiosResponse);
    
    wrapper = createWrapper();
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
    
    // Editor should not be displayed
    const editor = wrapper.find('[data-testid="tinymce-editor"]');
    expect(editor.exists()).toBe(false);
    
    // Warning message should be displayed
    const alert = wrapper.find('.v-alert');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toContain('TinyMCE editor tidak dapat dimuat karena API key tidak dikonfigurasi');
  });

  test('should not display editor when API call fails', async () => {
    vi.mocked(getConfigKey).mockRejectedValue(responseConfigKeyError);
    
    wrapper = createWrapper();
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
    
    // Editor should not be displayed
    const editor = wrapper.find('[data-testid="tinymce-editor"]');
    expect(editor.exists()).toBe(false);
    
    // Warning message should be displayed
    const alert = wrapper.find('.v-alert');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toContain('TinyMCE editor tidak dapat dimuat karena API key tidak dikonfigurasi');
  });

  test('should respect disabled prop', async () => {
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    
    wrapper = createWrapper({ disabled: true });
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
    
    // Editor should be disabled when disabled prop is true
    const editorComponent = wrapper.findComponent({ name: 'Editor' });
    expect(editorComponent.exists()).toBe(true);
    expect(editorComponent.props('disabled')).toBe(true);
  });
});
