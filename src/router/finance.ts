import MasterLayout from '@/layouts/Master.vue';

export const financeRoutes = {
  path: 'finance',
  meta: {
    isAuth: true,
    coreSystem: 'CoreSystem',
  },
  component: MasterLayout,
  children: [
    {
      path: 'cash-balance',
      name: 'cashbalance',
      meta: {
        label: 'Cash Balance',
      },
      component: () => import('@/pages/Finance/CashBalance/Index.vue'),
    },
    {
      path: 'dues',
      name: 'dues',
      meta: {
        label: 'Membership Dues',
      },
      component: () => import('@/pages/Finance/Dues/Index.vue'),
    },
  ],
};

