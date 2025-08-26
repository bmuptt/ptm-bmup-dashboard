import LoginLayout from '../pages/Login.vue';
import HomeLayout from '@/pages/Home.vue';

export const coreRoutes = [
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
];
