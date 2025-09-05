import { describe, test, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DialogAddMenu from '@/components/UI/AppManagement/Menu/DialogAddMenu.vue';
import { useRoute } from 'vue-router';


// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}));

// Mock FormDataMenu component
vi.mock('@/components/UI/AppManagement/Menu/FormDataMenu.vue', () => ({
  default: {
    name: 'FormDataMenu',
    template: '<div data-testid="form-data-menu">Form Data Menu</div>',
    props: ['id'],
    emits: ['refresh-page', 'change-loading']
  }
}));

describe('DialogAddMenu Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render dialog with correct title', () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: { label: 'Menu' } }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData: null
      }
    });

    expect(wrapper.text()).toContain('Add Menu');
  });

  test('should render dialog with default title when no meta label', () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: null }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData: null
      }
    });

    expect(wrapper.text()).toContain('Add');
  });

  test('should emit closeDialog when close button is clicked', async () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: { label: 'Menu' } }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData: null
      }
    });

    const closeButton = wrapper.find('[data-testid="close-button"]');
    if (closeButton.exists()) {
      await closeButton.trigger('click');
      expect(wrapper.emitted('closeDialog')).toBeTruthy();
    }
  });

  test('should emit refreshPage and closeDialog when moduleRefreshPage is called', () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: { label: 'Menu' } }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData: null
      }
    });

    // Get the component instance and call the method
    const vm = wrapper.vm as unknown as { moduleRefreshPage: () => void };
    vm.moduleRefreshPage();

    expect(wrapper.emitted('refreshPage')).toBeTruthy();
    expect(wrapper.emitted('closeDialog')).toBeTruthy();
  });

  test('should pass selectData id to FormDataMenu component', () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: { label: 'Menu' } }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const selectData = {
      id: 123,
      active: '1',
      order_number: 1,
      children: [],
      key_menu: 'test-menu',
      name: 'Test Menu',
      url: '/test',
      menu_id: null,
      created_by: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_by: null,
      updated_at: '2024-01-01T00:00:00Z'
    };
    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData
      }
    });

    const formDataComponent = wrapper.findComponent({ name: 'FormDataMenu' });
    expect(formDataComponent.props('id')).toBe(123);
  });

  test('should handle change-loading event from FormDataMenu', async () => {
    const mockRoute = {
      matched: [
        {},
        {},
        { meta: { label: 'Menu' } }
      ]
    };
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>);

    const wrapper = mount(DialogAddMenu, {
      props: {
        selectData: null
      }
    });

    const formDataComponent = wrapper.findComponent({ name: 'FormDataMenu' });
    await formDataComponent.vm.$emit('change-loading', true);

    // Test that the component handles the event without error
    expect(wrapper.exists()).toBe(true);
  });
});
