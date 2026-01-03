import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import Index from '@/pages/Setting/GalleryItems/Index.vue';
import { getPermission } from '@/service/auth';

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      matched: [{}, {}, { name: 'galleryitems', meta: { label: 'Galeri' } }],
    }),
  };
});

vi.mock('@/components/UI/Setting/GalleryItems/GalleryItemsManager.vue', () => ({
  default: {
    name: 'GalleryItemsManager',
    template: '<div data-testid="gallery-items-manager-stub"></div>',
    props: ['permission'],
  },
}));

describe('Setting Gallery Items Page', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });

    (getPermission as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: {
          access: true,
          create: true,
          update: true,
          delete: true,
          approval: false,
          approval_2: false,
          approval_3: false,
        },
      },
    } as AxiosResponse);
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    wrapper = mount(Index, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  test('renders label and manager stub', async () => {
    mountComponent();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Galeri');
    expect(wrapper.find('[data-testid="gallery-items-manager-stub"]').exists()).toBe(true);
    expect(getPermission).toHaveBeenCalled();
  });
});

