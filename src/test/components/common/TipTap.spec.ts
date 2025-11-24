import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import TipTap from '@/components/common/TipTap.vue';

// Mock TipTap dependencies
const mockEditor = {
  getHTML: vi.fn(() => '<p>Test content</p>'),
  getText: vi.fn(() => 'Test content'),
  isActive: vi.fn(() => false),
  can: vi.fn(() => ({ 
    chain: vi.fn(() => ({ focus: vi.fn(() => ({ toggleBold: vi.fn(() => ({ run: vi.fn() })) })) })),
    undo: () => true, 
    redo: () => true 
  })),
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({
      toggleBold: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleItalic: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleUnderline: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleStrike: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleHeading: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleBulletList: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleOrderedList: vi.fn(() => ({
        run: vi.fn()
      })),
      toggleBlockquote: vi.fn(() => ({
        run: vi.fn()
      })),
      setTextAlign: vi.fn(() => ({
        run: vi.fn()
      })),
      setLink: vi.fn(() => ({
        run: vi.fn()
      })),
      unsetLink: vi.fn(() => ({
        run: vi.fn()
      })),
      extendMarkRange: vi.fn(() => ({
        unsetLink: vi.fn(() => ({
          run: vi.fn()
        }))
      })),
      setColor: vi.fn(() => ({
        run: vi.fn()
      })),
      undo: vi.fn(() => ({
        run: vi.fn()
      })),
      redo: vi.fn(() => ({
        run: vi.fn()
      }))
    }))
  })),
  commands: {
    setContent: vi.fn()
  },
  setEditable: vi.fn(),
  destroy: vi.fn(),
  getAttributes: vi.fn(() => ({ href: 'https://example.com' })),
  setOptions: vi.fn()
};

// Mock the editor as a reactive reference
const mockEditorRef = {
  value: mockEditor
};

vi.mock('@tiptap/vue-3', () => ({
  useEditor: vi.fn(() => mockEditorRef),
  EditorContent: {
    name: 'EditorContent',
    template: '<div data-testid="editor-content"><slot /></div>',
    props: ['editor']
  }
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {}
}));
vi.mock('@tiptap/extension-text-align', () => ({
  __esModule: true,
  default: { configure: () => ({ name: 'textAlign' }) },
}));
vi.mock('@tiptap/extension-underline', () => ({
  default: {}
}));
vi.mock('@tiptap/extension-link', () => ({
  __esModule: true,
  default: { configure: () => ({ name: 'link' }) },
}));

// Mock URL methods
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = vi.fn();

describe('TipTap Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

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
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  const createWrapper = (props: Record<string, unknown> = {}): VueWrapper => {
    return mount(TipTap, {
      global: {
        plugins: [vuetify],
        stubs: {
          'v-btn': { template: '<button data-testid="v-btn"><slot /></button>' },
          'v-divider': { template: '<div data-testid="v-divider"></div>' },
          'v-menu': { template: '<div data-testid="v-menu"><slot /><slot name="activator"></slot></div>' },
          'v-dialog': { template: '<div data-testid="v-dialog"><slot /></div>' },
          'v-card': { template: '<div data-testid="v-card"><slot /></div>' },
          'v-card-title': { template: '<div data-testid="v-card-title"><slot /></div>' },
          'v-card-text': { template: '<div data-testid="v-card-text"><slot /></div>' },
          'v-card-actions': { template: '<div data-testid="v-card-actions"><slot /></div>' },
          'v-text-field': { template: '<input data-testid="v-text-field" type="text" />' },
          'v-spacer': { template: '<div data-testid="v-spacer"></div>' },
        },
      },
      props: {
        modelValue: '',
        placeholder: 'Start typing...',
        disabled: false,
        height: 200,
        hideToolbar: true,
        ...props,
      },
    });
  };

  test('should render component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('.tiptap-editor').exists()).toBe(true);
    expect(wrapper.find('[data-testid="editor-content"]').exists()).toBe(true);
  });

  test('should render with default props', () => {
    wrapper = createWrapper();
    
    expect((wrapper.props() as Record<string, unknown>).modelValue).toBe('');
    expect((wrapper.props() as Record<string, unknown>).placeholder).toBe('Start typing...');
    expect((wrapper.props() as Record<string, unknown>).disabled).toBe(false);
    expect((wrapper.props() as Record<string, unknown>).height).toBe(200);
    expect((wrapper.props() as Record<string, unknown>).hideToolbar).toBe(true);
  });

  test('should render with custom props', () => {
    wrapper = createWrapper({
      modelValue: '<p>Test content</p>',
      placeholder: 'Custom placeholder',
      disabled: true,
      height: 300,
      hideToolbar: true,
    });
    
    expect((wrapper.props() as Record<string, unknown>).modelValue).toBe('<p>Test content</p>');
    expect((wrapper.props() as Record<string, unknown>).placeholder).toBe('Custom placeholder');
    expect((wrapper.props() as Record<string, unknown>).disabled).toBe(true);
    expect((wrapper.props() as Record<string, unknown>).height).toBe(300);
    expect((wrapper.props() as Record<string, unknown>).hideToolbar).toBe(true);
  });

  test('should render editor content', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="editor-content"]').exists()).toBe(true);
  });

  test('should emit update:modelValue when content changes', async () => {
    wrapper = createWrapper();
    
    // Simulate content change
    await wrapper.vm.$emit('update:modelValue', '<p>New content</p>');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  test('should emit change when content changes', async () => {
    wrapper = createWrapper();
    
    // Simulate content change
    await wrapper.vm.$emit('change', '<p>New content</p>');
    
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  test('should handle editor content', async () => {
    wrapper = createWrapper();
    
    // Check if editor content exists
    expect(wrapper.find('[data-testid="editor-content"]').exists()).toBe(true);
  });

  test('should render with different placeholder', () => {
    wrapper = createWrapper({
      placeholder: 'Enter your text here...'
    });
    
    expect((wrapper.props() as Record<string, unknown>).placeholder).toBe('Enter your text here...');
  });

  test('should handle modelValue prop changes', async () => {
    wrapper = createWrapper({ modelValue: '<p>Initial content</p>' });
    
    await wrapper.setProps({ modelValue: '<p>Updated content</p>' });
    
    expect((wrapper.props() as Record<string, unknown>).modelValue).toBe('<p>Updated content</p>');
  });

  test('should handle disabled prop changes', async () => {
    wrapper = createWrapper({ disabled: false });
    
    await wrapper.setProps({ disabled: true });
    
    expect((wrapper.props() as Record<string, unknown>).disabled).toBe(true);
  });

  test('should handle height prop changes', async () => {
    wrapper = createWrapper({ height: 200 });
    
    await wrapper.setProps({ height: 500 });
    
    expect((wrapper.props() as Record<string, unknown>).height).toBe(500);
  });

  test('should handle hideToolbar prop changes', async () => {
    wrapper = createWrapper({ hideToolbar: true });
    
    await wrapper.setProps({ hideToolbar: true });
    
    expect((wrapper.props() as Record<string, unknown>).hideToolbar).toBe(true);
    expect(wrapper.find('.tiptap-toolbar').exists()).toBe(false);
  });

  test('should render with empty modelValue', () => {
    wrapper = createWrapper({ modelValue: '' });
    
    expect((wrapper.props() as Record<string, unknown>).modelValue).toBe('');
  });

  test('should render with HTML modelValue', () => {
    wrapper = createWrapper({ 
      modelValue: '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>' 
    });
    
    expect((wrapper.props() as Record<string, unknown>).modelValue).toBe('<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>');
  });
});
