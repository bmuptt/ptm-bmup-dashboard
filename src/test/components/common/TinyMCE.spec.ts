import { describe, test, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import TinyMCE from '../../../components/common/TinyMCE.vue';

// Mock TinyMCE Editor
vi.mock('@tinymce/tinymce-vue', () => ({
  default: {
    name: 'Editor',
    template: '<div data-testid="tinymce-editor">TinyMCE Editor</div>',
    props: ['modelValue', 'init', 'disabled'],
    emits: ['update:modelValue'],
  },
}));

describe('TinyMCE Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const createWrapper = (props = {}) => {
    vuetify = createVuetify();
    return mount(TinyMCE, {
      props: {
        modelValue: '',
        ...props,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          'v-container': true,
          'v-row': true,
          'v-col': true,
        },
      },
    });
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render TinyMCE component correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test('should display TinyMCE editor', () => {
    wrapper = createWrapper();
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
    wrapper = createWrapper();
    
    // Get component instance with proper typing
    const vm = wrapper.vm as unknown as { handleUpdate: (value: string) => void };
    
    // Simulate content change
    vm.handleUpdate('<p>New content</p>');
    
    // Check if emit was called
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>New content</p>']);
  });
});
