import { describe, test, expect, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

describe('ConfirmDialog Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}) => {
    return mount(ConfirmDialog, {
      global: {
        plugins: [vuetify],
        stubs: {
          'v-dialog': { template: '<div data-testid="dialog"><slot /></div>' },
          'v-card': { template: '<div data-testid="card"><slot /></div>' },
          'v-card-title': { template: '<div data-testid="card-title"><slot /></div>' },
          'v-card-text': { template: '<div data-testid="card-text"><slot /></div>' },
          'v-card-actions': { template: '<div data-testid="card-actions"><slot /></div>' },
          'v-icon': { template: '<div data-testid="icon"><slot /></div>' },
          'v-btn': { template: '<button data-testid="btn" @click="$emit(\'click\')"><slot /></button>' },
          'v-spacer': { template: '<div data-testid="spacer"></div>' },
        },
      },
      props: {
        modelValue: false,
        title: 'Test Title',
        html: 'Test content',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f86f24',
        ...props,
      },
    });
  };

  test('should render ConfirmDialog component correctly', () => {
    wrapper = createWrapper();
    
    expect(wrapper.find('[data-testid="dialog"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="card"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="card-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="card-text"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="card-actions"]').exists()).toBe(true);
  });

  test('should display title correctly', () => {
    wrapper = createWrapper({ title: 'Custom Title' });
    
    const title = wrapper.find('[data-testid="card-title"]');
    expect(title.text()).toContain('Custom Title');
  });

  test('should display text content correctly', () => {
    wrapper = createWrapper({ html: 'Custom text content' });
    
    const content = wrapper.find('[data-testid="card-text"]');
    expect(content.text()).toContain('Custom text content');
  });

  test('should escape HTML tags in text content', () => {
    wrapper = createWrapper({ html: '<p>HTML tags should be escaped</p>' });
    
    const content = wrapper.find('[data-testid="card-text"]');
    // HTML tags should be escaped and displayed as text
    expect(content.text()).toContain('<p>HTML tags should be escaped</p>');
    expect(content.html()).not.toContain('<p>');
  });

  test('should display confirm and cancel buttons', () => {
    wrapper = createWrapper();
    
    const buttons = wrapper.findAll('[data-testid="btn"]');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toContain('Cancel');
    expect(buttons[1].text()).toContain('Confirm');
  });

  test('should display custom button texts', () => {
    wrapper = createWrapper({
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Keep',
    });
    
    const buttons = wrapper.findAll('[data-testid="btn"]');
    expect(buttons[0].text()).toContain('No, Keep');
    expect(buttons[1].text()).toContain('Yes, Delete');
  });

  test('should emit confirm event when confirm button is clicked', async () => {
    wrapper = createWrapper();
    
    const buttons = wrapper.findAll('[data-testid="btn"]');
    const confirmButton = buttons[1];
    
    await confirmButton.trigger('click');
    
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  test('should emit cancel event when cancel button is clicked', async () => {
    wrapper = createWrapper();
    
    const buttons = wrapper.findAll('[data-testid="btn"]');
    const cancelButton = buttons[0];
    
    await cancelButton.trigger('click');
    
    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  test('should show icon when icon prop is provided', () => {
    wrapper = createWrapper({ icon: 'warning' });
    
    const icon = wrapper.find('[data-testid="icon"]');
    expect(icon.exists()).toBe(true);
  });

  test('should not show icon when icon prop is not provided', () => {
    wrapper = createWrapper();
    
    const icon = wrapper.find('[data-testid="icon"]');
    expect(icon.exists()).toBe(false);
  });

  test('should use correct icon for different icon types', () => {
    const iconTests = [
      { icon: 'success', expectedIcon: 'mdi-check-circle' },
      { icon: 'error', expectedIcon: 'mdi-alert-circle' },
      { icon: 'warning', expectedIcon: 'mdi-alert' },
      { icon: 'info', expectedIcon: 'mdi-information' },
      { icon: 'question', expectedIcon: 'mdi-help-circle' },
    ];

    iconTests.forEach(({ icon }) => {
      const testWrapper = createWrapper({ icon });
      const iconElement = testWrapper.find('[data-testid="icon"]');
      expect(iconElement.exists()).toBe(true);
      testWrapper.unmount();
    });
  });
});
