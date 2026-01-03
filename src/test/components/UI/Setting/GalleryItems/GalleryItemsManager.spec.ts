import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import GalleryItemsManager from '@/components/UI/Setting/GalleryItems/GalleryItemsManager.vue';
import { listGalleryItems, sortGalleryItems, deleteGalleryItem } from '@/service/Setting/galleryItems';
import type { IResPermission } from '@/model/auth-interface';

const displayState = vi.hoisted(() => ({
  smAndDown: null as unknown as { value: boolean } | null,
}));

vi.mock('vuetify', async () => {
  const actual = await vi.importActual<typeof import('vuetify')>('vuetify');
  const vue = await vi.importActual<typeof import('vue')>('vue');
  if (!displayState.smAndDown) displayState.smAndDown = vue.ref(false);

  return {
    ...actual,
    useDisplay: () => ({
      smAndDown: displayState.smAndDown!,
    }),
  };
});

vi.mock('vuedraggable', () => ({
  default: {
    name: 'draggable',
    props: ['modelValue', 'tag', 'itemKey'],
    emits: ['update:modelValue'],
    template: `
      <div>
        <slot
          v-for="element in modelValue"
          :key="element.id"
          name="item"
          :element="element"
        />
      </div>
    `,
  },
}));

vi.mock('@/service/Setting/galleryItems', () => ({
  listGalleryItems: vi.fn(),
  sortGalleryItems: vi.fn(),
  deleteGalleryItem: vi.fn(),
}));

vi.mock('@/components/common/ConfirmDialog.vue', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div data-testid="confirm-dialog">Confirm Dialog</div>',
    props: ['modelValue', 'title', 'html', 'confirmButtonText', 'cancelButtonText', 'confirmButtonColor', 'icon'],
    emits: ['confirm', 'cancel', 'update:modelValue'],
  },
}));

vi.mock('@/components/UI/Setting/GalleryItems/DialogFormGalleryItem.vue', () => ({
  default: {
    name: 'DialogFormGalleryItem',
    template: '<div data-testid="dialog-form-gallery-item">Dialog Form Gallery Item</div>',
    props: ['selectData'],
    emits: ['close-dialog', 'refresh-page'],
  },
}));

vi.mock('@/utils/confirm-dialog', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');
  return {
    useConfirmDialog: vi.fn(() => ({
      showDialog: vue.ref(false),
      dialogOptions: vue.ref({
        title: '',
        html: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonColor: '',
        icon: '',
      }),
      showConfirm: vi.fn(() => Promise.resolve(true)),
      handleConfirm: vi.fn(),
      handleCancel: vi.fn(),
    })),
  };
});

describe('GalleryItemsManager', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  const mountComponent = (permission: IResPermission) => {
    wrapper = mount(GalleryItemsManager, {
      props: { permission },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
      },
    });
  };

  beforeEach(() => {
    if (displayState.smAndDown) displayState.smAndDown.value = false;
    vuetify = createVuetify({
      components,
      directives,
    });

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

  test('fetchGalleryItems calls list service with filter params', async () => {
    vi.mocked(listGalleryItems).mockResolvedValue({
      data: {
        success: true,
        count: 1,
        data: [
          {
            id: 11,
            image_url: 'https://example.com/a.jpg',
            title: 'A',
            display_order: 1,
            is_published: true,
            created_by: 1,
            updated_by: 1,
            created_at: '2026-01-02T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z',
          },
        ],
      },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: true,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    expect(listGalleryItems).toHaveBeenCalled();

    const vm = wrapper.vm as unknown as { publishedFilter: '' | 'true' | 'false'; fetchGalleryItems: () => void };
    vm.publishedFilter = 'true';
    vm.fetchGalleryItems();
    await flushPromises();

    expect(listGalleryItems).toHaveBeenCalledWith({ is_published: true });
  });

  test('submitSort calls sort service with ids', async () => {
    vi.mocked(listGalleryItems).mockResolvedValue({
      data: {
        success: true,
        count: 2,
        data: [
          {
            id: 11,
            image_url: 'https://example.com/a.jpg',
            title: 'A',
            display_order: 1,
            is_published: true,
            created_by: 1,
            updated_by: 1,
            created_at: '2026-01-02T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z',
          },
          {
            id: 12,
            image_url: 'https://example.com/b.jpg',
            title: 'B',
            display_order: 2,
            is_published: false,
            created_by: 1,
            updated_by: 1,
            created_at: '2026-01-02T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z',
          },
        ],
      },
    } as AxiosResponse);

    vi.mocked(sortGalleryItems).mockResolvedValue({
      data: { success: true, message: 'ok' },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: false,
      update: true,
      delete: false,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    const updateSortBtn = wrapper.find('[data-testid="update-sort-gallery-item-btn"]');
    expect(updateSortBtn.exists()).toBe(true);
    await updateSortBtn.trigger('click');
    await flushPromises();

    expect(sortGalleryItems).toHaveBeenCalledWith({ ids: ['11', '12'] });
  });

  test('confirmDelete calls delete service when confirmed', async () => {
    vi.mocked(listGalleryItems).mockResolvedValue({
      data: { success: true, count: 0, data: [] },
    } as AxiosResponse);

    vi.mocked(deleteGalleryItem).mockResolvedValue({
      data: { success: true, message: 'deleted' },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: false,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    const vm = wrapper.vm as unknown as { confirmDelete: (id: number) => void };
    vm.confirmDelete(99);
    await flushPromises();

    expect(deleteGalleryItem).toHaveBeenCalledWith(99);
  });

  test('mobile layout renders full-width image block when image_url exists', async () => {
    if (displayState.smAndDown) displayState.smAndDown.value = true;

    vi.mocked(listGalleryItems).mockResolvedValue({
      data: {
        success: true,
        count: 1,
        data: [
          {
            id: 11,
            image_url: 'https://example.com/a.jpg',
            title: 'A',
            display_order: 1,
            is_published: true,
            created_by: 1,
            updated_by: 1,
            created_at: '2026-01-02T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z',
          },
        ],
      },
    } as AxiosResponse);

    mountComponent({
      access: true,
      create: true,
      update: true,
      delete: true,
      approval: false,
      approval_2: false,
      approval_3: false,
    });

    await flushPromises();

    const imageBlock = wrapper.find('[data-testid="gallery-item-mobile-image"]');
    expect(imageBlock.exists()).toBe(true);
  });
});
