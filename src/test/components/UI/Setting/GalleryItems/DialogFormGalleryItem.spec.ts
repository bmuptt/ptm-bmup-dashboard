import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import DialogFormGalleryItem from '@/components/UI/Setting/GalleryItems/DialogFormGalleryItem.vue';
import { createGalleryItem, getGalleryItemDetail, updateGalleryItem } from '@/service/Setting/galleryItems';

const displayState = vi.hoisted(() => ({
  xs: null as unknown as { value: boolean } | null,
}));

vi.mock('vuetify', async () => {
  const actual = await vi.importActual<typeof import('vuetify')>('vuetify');
  const vue = await vi.importActual<typeof import('vue')>('vue');
  if (!displayState.xs) displayState.xs = vue.ref(false);

  return {
    ...actual,
    useDisplay: () => ({
      xs: displayState.xs!,
    }),
  };
});

vi.mock('@/service/Setting/galleryItems', () => ({
  createGalleryItem: vi.fn(),
  getGalleryItemDetail: vi.fn(),
  updateGalleryItem: vi.fn(),
}));

describe('DialogFormGalleryItem', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    if (displayState.xs) displayState.xs.value = false;
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

  test('default published is true on create form', async () => {
    wrapper = mount(DialogFormGalleryItem, {
      props: { selectData: null },
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
    });

    const vm = wrapper.vm as unknown as { state: { is_published: boolean } };
    await flushPromises();
    expect(vm.state.is_published).toBe(true);
  });

  test('submit create calls createGalleryItem', async () => {
    vi.mocked(createGalleryItem).mockResolvedValue({
      data: { success: true, message: 'ok' },
    } as AxiosResponse);

    wrapper = mount(DialogFormGalleryItem, {
      props: { selectData: null },
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
    });

    const vm = wrapper.vm as unknown as {
      state: { title: string; image: File | null; is_published: boolean };
      submitForm: () => void;
    };
    vm.state.title = 'Gallery A';
    vm.state.image = new File(['test'], 'a.jpg', { type: 'image/jpeg' });

    vm.submitForm();
    await flushPromises();

    expect(createGalleryItem).toHaveBeenCalled();
    const formData = vi.mocked(createGalleryItem).mock.calls[0][0] as FormData;
    const keys = Array.from(formData.keys());
    expect(keys).not.toContain('status_file');
  });

  test('submit update calls updateGalleryItem with status_file=0 when no new image', async () => {
    vi.mocked(getGalleryItemDetail).mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
      },
    } as AxiosResponse);

    vi.mocked(updateGalleryItem).mockResolvedValue({
      data: { success: true, message: 'ok' },
    } as AxiosResponse);

    wrapper = mount(DialogFormGalleryItem, {
      props: {
        selectData: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
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
    });

    await flushPromises();

    const vm = wrapper.vm as unknown as {
      state: { title: string; image: File | null; is_published: boolean; status_file: '0' | '1' };
      submitForm: () => void;
    };
    vm.state.title = 'Gallery A Updated';
    vm.state.is_published = false;
    vm.state.image = null;
    vm.state.status_file = '0';

    vm.submitForm();
    await flushPromises();

    expect(updateGalleryItem).toHaveBeenCalledWith(1, expect.any(FormData));
    const formData = vi.mocked(updateGalleryItem).mock.calls[0][1] as FormData;
    const entries = Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? v.name : String(v)]);
    expect(entries).toContainEqual(['status_file', '0']);
    expect(entries.find(([k]) => k === 'image')).toBeUndefined();
  });

  test('submit update calls updateGalleryItem with status_file=1 when new image selected', async () => {
    vi.mocked(getGalleryItemDetail).mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
      },
    } as AxiosResponse);

    vi.mocked(updateGalleryItem).mockResolvedValue({
      data: { success: true, message: 'ok' },
    } as AxiosResponse);

    wrapper = mount(DialogFormGalleryItem, {
      props: {
        selectData: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
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
    });

    await flushPromises();

    const vm = wrapper.vm as unknown as {
      state: { title: string; image: File | null; is_published: boolean; status_file: '0' | '1' };
      submitForm: () => void;
    };
    vm.state.title = 'Gallery A Updated';
    vm.state.is_published = false;
    vm.state.status_file = '1';
    vm.state.image = new File(['test'], 'b.jpg', { type: 'image/jpeg' });

    vm.submitForm();
    await flushPromises();

    expect(updateGalleryItem).toHaveBeenCalledWith(1, expect.any(FormData));
    const formData = vi.mocked(updateGalleryItem).mock.calls[0][1] as FormData;
    const entries = Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? v.name : String(v)]);
    expect(entries).toContainEqual(['status_file', '1']);
    expect(entries).toContainEqual(['image', 'b.jpg']);
  });

  test('delete image on edit clears preview and blocks submit until new upload', async () => {
    vi.mocked(getGalleryItemDetail).mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
      },
    } as AxiosResponse);

    wrapper = mount(DialogFormGalleryItem, {
      props: {
        selectData: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
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
    });

    await flushPromises();

    const vm = wrapper.vm as unknown as {
      state: { title: string; image: File | null; status_file: '0' | '1'; image_url: string | null };
      currentImage: string;
      deleteImage: () => void;
      submitForm: () => void;
    };

    vm.state.title = 'A Updated';
    vm.deleteImage();
    await flushPromises();

    expect(vm.state.status_file).toBe('1');
    expect(vm.state.image).toBe(null);
    expect(vm.state.image_url).toBe(null);
    expect(vm.currentImage).toBe('');

    vm.submitForm();
    await flushPromises();

    expect(updateGalleryItem).not.toHaveBeenCalled();
  });

  test('xs layout stacks upload note and delete button under image', async () => {
    if (displayState.xs) displayState.xs.value = true;

    vi.mocked(getGalleryItemDetail).mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
      },
    } as AxiosResponse);

    wrapper = mount(DialogFormGalleryItem, {
      props: {
        selectData: {
          id: 1,
          image_url: 'https://example.com/a.jpg',
          title: 'A',
          display_order: 1,
          is_published: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
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
    });

    await flushPromises();

    const uploadRow = wrapper.find('[data-testid="gallery-upload-row"]');
    expect(uploadRow.classes()).toContain('flex-column');
    expect(wrapper.find('[data-testid="gallery-image-recommendation"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="gallery-image-delete"]').exists()).toBe(true);
  });
});
