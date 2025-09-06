/**
 * router/index.ts
 *
 * Main router configuration with modular route structure
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import LayoutDefault from '@/layouts/default.vue';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutDefault,
      children: routes,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      meta: {
        isAuth: false,
        isGlobal: true,
        coreSystem: 'NoCore',
      },
      component: () => import('@/pages/NotFound.vue'),
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
