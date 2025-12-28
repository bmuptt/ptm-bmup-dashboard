import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeSectionForm from '@/components/UI/Setting/Landing/HomeSectionForm.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { ILandingItem } from '@/model/landing-interface';

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = vi.fn();

const mockItems: ILandingItem[] = [
  { id: 1, key: 'hero', type: 'text', title: 'Hero', content: 'Content', published: true, image_url: null, button_label: null, button_url: null },
  { id: 2, key: 'tentang_kami', type: 'text', title: null, content: 'About', published: true, image_url: 'http://server/img.jpg', button_label: null, button_url: null },
  { id: 3, key: 'contact_email', type: 'text', title: null, content: 'email', published: true, image_url: null, button_label: null, button_url: null },
  { id: 4, key: 'contact_phone', type: 'text', title: null, content: 'phone', published: true, image_url: null, button_label: null, button_url: null },
];

describe('HomeSectionForm', () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
    vi.clearAllMocks();
  });

  it('initializes from props correctly', () => {
    const wrapper = mount(HomeSectionForm, {
      props: { items: mockItems },
      global: { plugins: [vuetify] },
    });

    const vm = wrapper.vm as unknown as {
      aboutContent: string;
      currentImage: string;
      imageStatus: string;
      imageFile: File | null;
      handleFileChange: (event: { target: { files: File[], value: string } }) => void;
    };
    expect(vm.aboutContent).toBe('About');
    expect(vm.currentImage).toBe('http://server/img.jpg');
    expect(vm.imageStatus).toBe('0');
  });

  it('preserves image state when prop updates with same image url (simulating parent sync)', async () => {
    const wrapper = mount(HomeSectionForm, {
      props: { items: mockItems },
      global: { plugins: [vuetify] },
    });

    const vm = wrapper.vm as unknown as {
      imageStatus: string;
      imageFile: File | null;
      currentImage: string;
      handleFileChange: (event: { target: { files: File[], value: string } }) => void;
    };

    // Simulate file upload
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file], value: 'test.png' } };
    
    // Call handleFileChange directly or trigger input
    vm.handleFileChange(event);
    
    expect(vm.imageStatus).toBe('1');
    expect(vm.imageFile).toBe(file);
    expect(vm.currentImage).toBe('blob:test-url');

    // Watcher in component emits update:items and update:image
    // Parent would update items prop with new image_url = 'blob:test-url'
    
    const updatedItems = JSON.parse(JSON.stringify(mockItems));
    updatedItems[1].image_url = 'blob:test-url';

    await wrapper.setProps({ items: updatedItems });

    // Should NOT reset
    expect(vm.imageStatus).toBe('1');
    expect(vm.imageFile).toBe(file);
    expect(vm.currentImage).toBe('blob:test-url');
  });

  it('resets image state when prop updates with DIFFERENT image url (simulating server fetch)', async () => {
    const wrapper = mount(HomeSectionForm, {
      props: { items: mockItems },
      global: { plugins: [vuetify] },
    });

    const vm = wrapper.vm as unknown as {
      imageStatus: string;
      imageFile: File | null;
      currentImage: string;
      handleFileChange: (event: { target: { files: File[], value: string } }) => void;
    };

    // Simulate file upload
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file], value: 'test.png' } };
    vm.handleFileChange(event);
    
    expect(vm.imageStatus).toBe('1');

    // Simulate server fetch returning a NEW url (or reverting to old one)
    const newItems = JSON.parse(JSON.stringify(mockItems));
    newItems[1].image_url = 'http://server/new-img.jpg';

    await wrapper.setProps({ items: newItems });

    // Should RESET
    expect(vm.imageStatus).toBe('0');
    expect(vm.imageFile).toBeNull();
    expect(vm.currentImage).toBe('http://server/new-img.jpg');
  });
});
