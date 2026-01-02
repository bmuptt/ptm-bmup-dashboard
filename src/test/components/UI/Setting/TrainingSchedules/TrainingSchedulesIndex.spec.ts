import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { AxiosResponse } from 'axios';
import Index from '@/pages/Setting/TrainingSchedules/Index.vue';
import { getPermission } from '@/service/auth';

vi.mock('@/service/auth', () => ({
  getPermission: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      matched: [{}, {}, { name: 'trainingschedules', meta: { label: 'Jadwal Latihan' } }],
    }),
  };
});

vi.mock('@/components/UI/Setting/TrainingSchedules/TrainingSchedulesManager.vue', () => ({
  default: {
    name: 'TrainingSchedulesManager',
    template: '<div data-testid="training-schedules-manager-stub"></div>',
    props: ['permission'],
  },
}));

describe('Setting Training Schedules Page', () => {
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
    wrapper?.unmount();
    vi.clearAllMocks();
  });

  test('renders manager component', async () => {
    expect(wrapper.find('[data-testid="training-schedules-manager-stub"]').exists()).toBe(true);
  });
});

