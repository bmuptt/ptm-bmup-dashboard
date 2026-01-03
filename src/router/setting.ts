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
    {
      path: 'landing',
      name: 'landing',
      meta: {
        label: 'Landing Page',
      },
      component: () => import('@/pages/Setting/Landing/Index.vue'),
    },
    {
      path: 'activities',
      name: 'activities',
      meta: {
        label: 'Activities',
      },
      component: () => import('@/pages/Setting/Activities/Index.vue'),
    },
    {
      path: 'about-timelines',
      name: 'abouttimelines',
      meta: {
        label: 'About Timeline',
      },
      component: () => import('@/pages/Setting/AboutTimelines/Index.vue'),
    },
    {
      path: 'about-team-members',
      name: 'aboutteammembers',
      meta: {
        label: 'Pengurus & Pelatih',
      },
      component: () => import('@/pages/Setting/AboutTeamMembers/Index.vue'),
    },
    {
      path: 'training-schedules',
      name: 'trainingschedules',
      meta: {
        label: 'Jadwal Latihan',
      },
      component: () => import('@/pages/Setting/TrainingSchedules/Index.vue'),
    },
    {
      path: 'gallery-items',
      name: 'galleryitems',
      meta: {
        label: 'Galeri',
      },
      component: () => import('@/pages/Setting/GalleryItems/Index.vue'),
    },
  ],
};
