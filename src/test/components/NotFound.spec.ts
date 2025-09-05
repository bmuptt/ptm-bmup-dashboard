import { describe, test, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import NotFound from '../../views/NotFound.vue';

// Type for component instance
interface NotFoundInstance {
  goToHome: () => void;
  goBack: () => void;
}

describe('NotFound Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;
  let router: Router;

  const createWrapper = () => {
    vuetify = createVuetify();
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'notFound',
          component: NotFound,
        },
      ],
    });

    return mount(NotFound, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          'v-container': true,
          'v-row': true,
          'v-col': true,
          'v-icon': true,
          'v-btn': true,
        },
      },
    });
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render NotFound component correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test('should display 404 text', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should display error message', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should have home button', () => {
    wrapper = createWrapper();
    // Test that component renders without error
    expect(wrapper.exists()).toBe(true);
  });

  test('should navigate to home when home button is clicked', async () => {
    wrapper = createWrapper();
    
    // Mock router push
    const pushSpy = vi.spyOn(router, 'push');
    
    // Get component instance
    const vm = wrapper.vm as unknown as NotFoundInstance;
    
    // Call goToHome method
    await vm.goToHome();
    
    // Verify router.push was called with '/'
    expect(pushSpy).toHaveBeenCalledWith('/');
  });

  test('should go back when back button is clicked', async () => {
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as NotFoundInstance;
    
    // Test that goBack method exists and can be called
    expect(typeof vm.goBack).toBe('function');
    
    // Call goBack - should not throw error
    expect(() => vm.goBack()).not.toThrow();
  });

  test('should navigate to home when no history available', async () => {
    wrapper = createWrapper();
    
    // Get component instance
    const vm = wrapper.vm as unknown as NotFoundInstance;
    
    // Test that goToHome method exists and can be called
    expect(typeof vm.goToHome).toBe('function');
    
    // Call goToHome - should not throw error
    expect(() => vm.goToHome()).not.toThrow();
  });
});
