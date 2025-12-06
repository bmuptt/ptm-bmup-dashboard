import { coreRoutes } from './core';
import { appManagementRoutes } from './app-management';
import { settingRoutes } from './setting';
import { financeRoutes } from './finance';

export const routes = [
  ...coreRoutes,
  appManagementRoutes,
  settingRoutes,
  financeRoutes,
];
