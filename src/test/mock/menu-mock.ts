import { AxiosHeaders } from 'axios';

export const responseMenuList = {
  data: {
    data: [
      {
        id: 1,
        key_menu: 'appmanagement',
        name: 'App Management',
        order_number: 1,
        url: null,
        menu_id: null,
        active: 'Active',
        created_by: 0,
        created_at: '2025-08-26T13:00:49.784Z',
        updated_by: null,
        updated_at: '2025-08-26T13:00:49.804Z',
        children: [
          {
            id: 2,
            key_menu: 'user',
            name: 'User',
            order_number: 1,
            url: '/app-management/user',
            menu_id: 1,
            active: 'Active',
            created_by: 0,
            created_at: '2025-08-26T13:00:49.798Z',
            updated_by: null,
            updated_at: '2025-08-26T13:00:49.798Z'
          }
        ]
      },
      {
        id: 6,
        key_menu: 'setting',
        name: 'Setting',
        order_number: 2,
        url: '',
        menu_id: null,
        active: 'Active',
        created_by: 1,
        created_at: '2025-08-27T16:29:01.893Z',
        updated_by: null,
        updated_at: '2025-08-27T16:29:01.893Z',
        children: []
      }
    ]
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
    url: '/app-management/menu/0',
    method: 'get',
  },
};

export const responseHardDeleteSuccess = {
  data: {
    message: 'Menu deleted successfully',
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
    url: '/app-management/menu/6/hard',
    method: 'delete',
  },
};

export const responseHardDeleteError = {
  response: {
    data: {
      message: 'Cannot delete menu with children',
    },
    status: 400,
  },
};
