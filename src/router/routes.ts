import { coreRoutes } from './core';
import { appManagementRoutes } from './app-management';
import { settingRoutes } from './setting';

export const routes = [
  ...coreRoutes,
  appManagementRoutes,
  settingRoutes,
];
