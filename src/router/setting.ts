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
      name: 'core',
      meta: {
        label: 'Core',
      },
      component: () => import('@/pages/Setting/Core/Index.vue'),
    },
    {
      path: 'member',
      name: 'member',
      meta: {
        label: 'Member',
      },
      component: () => import('@/pages/Setting/Member/Index.vue'),
    },
  ],
};
