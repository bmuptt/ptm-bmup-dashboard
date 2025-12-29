import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import Index from '@/pages/Setting/Activities/Index.vue';
import { getPermission } from '@/service/auth';

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      matched: [{}, {}, { name: 'activities', meta: { label: 'Activities' } }],
    }),
  };
});

vi.mock('@/components/UI/Setting/Landing/Activities/ActivitiesManager.vue', () => ({
  default: {
    name: 'ActivitiesManager',
    template: '<div data-testid="activities-manager-stub"></div>',
    props: ['permission'],
  },
}));

describe('Setting Activities Page', () => {
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

    wrapper = mount(Index, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    vi.clearAllMocks();
  });

  test('renders title and fetches permission then passes it to ActivitiesManager', async () => {
    expect(wrapper.text()).toContain('Activities');
    expect(getPermission).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const manager = wrapper.findComponent({ name: 'ActivitiesManager' });
    expect(manager.exists()).toBe(true);
    expect(manager.props('permission')).toMatchObject({ create: true, update: true, delete: true });
  });
});

