import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DialogFormAboutTeamMember from '@/components/UI/Setting/Landing/AboutTeamMembers/DialogFormAboutTeamMember.vue';

vi.mock('@/components/UI/Setting/Landing/AboutTeamMembers/MemberSelectionDialog.vue', () => ({
  default: {
    name: 'MemberSelectionDialog',
    props: ['modelValue', 'disabled'],
    emits: ['update:modelValue', 'select', 'update:loading'],
    template: `
      <div data-testid="member-selection-dialog-stub">
        <button
          data-testid="stub-select-member"
          @click="$emit('select', { id: 1, name: 'John Doe', username: 'johndoe' })"
        >
          Select
        </button>
      </div>
    `,
  },
}));

describe('DialogFormAboutTeamMember', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
    (globalThis as unknown as { visualViewport?: unknown }).visualViewport = {
      width: 1024,
      height: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as VisualViewport;

    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
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
    }
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    wrapper = mount(DialogFormAboutTeamMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
        stubs: {
          teleport: true,
        },
      },
      attachTo: document.body,
    });
  };

  test('memilih member dari dialog akan mengisi field Member', async () => {
    mountComponent();
    await flushPromises();

    await wrapper.find('[data-testid="open-member-selection-btn"]').trigger('click');
    await flushPromises();

    const selectBtn = wrapper.find('[data-testid="stub-select-member"]');
    expect(selectBtn.exists()).toBe(true);
    await selectBtn.trigger('click');
    await flushPromises();

    const memberFieldInput = wrapper.find('[data-testid="member-selection-field"] input');
    expect((memberFieldInput.element as HTMLInputElement).value).toBe('John Doe (johndoe)');
  });
});
