/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import LayoutDefault from '@/layouts/default.vue';
import LoginLayout from '../pages/Login.vue';
import HomeLayout from '@/pages/Home.vue';
import MasterLayout from '@/layouts/Master.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutDefault,
      children: [
        {
          path: '',
          name: 'Login',
          meta: {
            isAuth: false,
            coreSystem: 'NoCore',
          },
          component: LoginLayout,
        },
        {
          path: 'home',
          name: 'Home',
          meta: {
            isAuth: true,
            coreSystem: 'CoreSystem',
          },
          component: HomeLayout,
        },
        {
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
              component: () =>
                import('@/pages/AppManagement/RoleMenu/Index.vue'),
            },
          ],
        },
        {
          path: 'master',
          meta: {
            isAuth: true,
            coreSystem: 'CoreSystem',
          },
          component: MasterLayout,
          children: [
            {
              path: 'branch',
              name: 'branch',
              meta: {
                label: 'Branch',
              },
              component: () => import('@/pages/Master/Branch/Index.vue'),
            },
          ]
        }
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('refresh_token');

  if (
    to.matched[0].meta.isGlobal === true ||
    to.matched[1].meta.isGlobal === true
  ) {
    next();
  } else {
    if (to.matched[1].meta.isAuth === true) {
      if (!token) {
        next({
          path: '/',
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      if (!token) {
        next();
      } else {
        next('/home');
      }
    }
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
