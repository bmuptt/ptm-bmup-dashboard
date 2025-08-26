# Router Structure

This directory contains the modular routing configuration for the application.

## File Structure

```
src/router/
├── index.ts          # Main router configuration
├── routes.ts         # Route aggregator
├── core.ts           # Core routes (Login, Home)
├── app-management.ts # App Management routes
└── README.md         # This file
```

## Architecture

### Modular Approach
- Each feature/module has its own route file
- Routes are organized by functionality
- Easy to maintain and extend

### File Descriptions

#### `index.ts`
- Main router configuration
- Sets up Vue Router with history mode
- Imports and uses modular routes

#### `routes.ts`
- Aggregates all route modules
- Central place to manage route imports
- Easy to add/remove route modules

#### `core.ts`
- Core application routes
- Login and Home pages
- Routes that don't belong to specific modules

#### `app-management.ts`
- App Management module routes
- User, Role, Menu, RoleMenu management
- Uses MasterLayout component

## Adding New Routes

1. Create a new route file (e.g., `new-module.ts`)
2. Export the route configuration
3. Import and add to `routes.ts`
4. The main router will automatically include it

## Example: Adding a New Module

```typescript
// new-module.ts
import MasterLayout from '@/layouts/Master.vue';

export const newModuleRoutes = {
  path: 'new-module',
  meta: {
    isAuth: true,
    coreSystem: 'CoreSystem',
  },
  component: MasterLayout,
  children: [
    {
      path: 'list',
      name: 'new-module-list',
      component: () => import('@/pages/NewModule/List.vue'),
    },
  ],
};

// routes.ts
import { newModuleRoutes } from './new-module';

export const routes = [
  ...coreRoutes,
  appManagementRoutes,
  newModuleRoutes, // Add here
];
```

## Benefits

- **Maintainability**: Each module's routes are isolated
- **Scalability**: Easy to add new modules
- **Readability**: Clear separation of concerns
- **Team Collaboration**: Multiple developers can work on different route files
- **Testing**: Easier to test individual route modules
