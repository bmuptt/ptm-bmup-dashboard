import MasterLayout from '@/layouts/Master.vue';

export const appManagementRoutes = {
  path: 'app-management',
  meta: {
    isAuth: true,
    coreSystem: 'CoreSystem',
  },
  component: MasterLayout,
  children: [
    {
      path: 'user',
      name: 'user',
      meta: {
        label: 'User',
      },
      component: () => import('@/pages/AppManagement/User/Index.vue'),
    },
    {
      path: 'role',
      name: 'role',
      meta: {
        label: 'Role',
      },
      component: () => import('@/pages/AppManagement/Role/Index.vue'),
    },
    {
      path: 'menu',
      name: 'menu',
      meta: {
        label: 'Menu',
      },
      component: () => import('@/pages/AppManagement/Menu/Index.vue'),
    },
    {
      path: 'role-menu',
      name: 'rolemenu',
      meta: {
        label: 'Role Menu',
      },
      component: () => import('@/pages/AppManagement/RoleMenu/Index.vue'),
    },
  ],
};
