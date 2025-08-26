import { coreRoutes } from './core';
import { appManagementRoutes } from './app-management';

export const routes = [
  ...coreRoutes,
  appManagementRoutes,
];
