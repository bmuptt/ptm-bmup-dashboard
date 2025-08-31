import MasterLayout from '@/layouts/Master.vue';

export const settingRoutes = {
  path: 'setting',
  meta: {
    isAuth: true,
    coreSystem: 'CoreSystem',
  },
  component: MasterLayout,
  children: [
    {
      path: 'core',
      name: 'setting-core',
      meta: {
        label: 'Core Setting',
      },
      component: () => import('@/pages/Setting/Core/Index.vue'),
    },
  ],
};
