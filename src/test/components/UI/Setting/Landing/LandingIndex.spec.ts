import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import Index from '@/pages/Setting/Landing/Index.vue';
import { getLandingSections, upsertLandingItems } from '@/service/Setting/landing';
import { getPermission } from '@/service/auth';

vi.mock('@/service/Setting/landing', () => ({
  getLandingSections: vi.fn(),
  upsertLandingItems: vi.fn(),
}));

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      matched: [{}, {}, { name: 'landing', meta: { label: 'Landing Page' } }],
    }),
  };
});

describe('Setting Landing Page', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(async () => {
    vuetify = createVuetify({
      components,
      directives,
    });

    (getPermission as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: {
          access: true,
          create: false,
          update: true,
          delete: false,
          approval: false,
          approval_2: false,
          approval_3: false,
        },
      },
    } as AxiosResponse);

    (getLandingSections as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            section: { id: 1, page_key: 'home' },
            items: [
              {
                id: 1,
                key: 'hero',
                type: 'text',
                title: 'Selamat Datang',
                content: 'BMUP Home',
                image_url: null,
                button_label: 'Mulai',
                button_url: '/home',
                published: true,
              },
              {
                id: 2,
                key: 'tentang_kami',
                type: 'text',
                title: null,
                content: 'Tentang kami singkat',
                image_url: null,
                button_label: null,
                button_url: null,
                published: true,
              },
              {
                id: 3,
                key: 'contact_email',
                type: 'text',
                title: null,
                content: 'support@example.com',
                image_url: null,
                button_label: null,
                button_url: 'mailto:support@example.com',
                published: true,
              },
              {
                id: 4,
                key: 'contact_phone',
                type: 'text',
                title: null,
                content: '08123456789',
                image_url: null,
                button_label: null,
                button_url: 'https://wa.me/628123456789',
                published: true,
              },
            ],
          },
          {
            section: { id: 2, page_key: 'about' },
            items: [
              {
                id: 5,
                key: 'visi',
                type: 'text',
                title: null,
                content: 'Visi konten',
                image_url: null,
                button_label: null,
                button_url: null,
                published: true,
              },
              {
                id: 6,
                key: 'misi',
                type: 'text',
                title: null,
                content: 'Misi konten',
                image_url: null,
                button_label: null,
                button_url: null,
                published: true,
              },
            ],
          },
        ],
      },
    } as AxiosResponse);

    (upsertLandingItems as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Landing items upserted successfully',
      },
    } as AxiosResponse);

    wrapper = mount(Index, {
      global: {
        plugins: [vuetify],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
        stubs: {
          TipTap: {
            template: '<div data-testid="tiptap-stub"></div>',
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

  test('renders layout and fetches sections', () => {
    expect(wrapper.text()).toContain('Landing Page');
    expect(getLandingSections).toHaveBeenCalled();
  });

  test('calls upsertLandingItems when save button clicked', async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    const saveButton = buttons.find((b) => b.text().includes('Simpan Perubahan'));
    if (!saveButton) {
      throw new Error('Save button not found');
    }
    await saveButton.trigger('click');

    expect(upsertLandingItems).toHaveBeenCalledTimes(1);
  });
});
