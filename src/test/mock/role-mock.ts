import type { AxiosResponse } from 'axios';

export const responseListSuccess: AxiosResponse = {
  data: {
    data: [
      {
        id: 1,
        name: 'Admin',
        description: 'Administrator role',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'User',
        description: 'Regular user role',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    total: 2,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {},
  } as unknown as AxiosResponse['config'],
};

export const responseListError = {
  response: {
    data: {
      message: 'Failed to fetch roles',
    },
    status: 500,
  },
};

export const responseDeleteSuccess: AxiosResponse = {
  data: {
    message: 'Role deleted successfully',
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {},
  } as unknown as AxiosResponse['config'],
};

export const responseDeleteError = {
  response: {
    data: {
      message: 'Failed to delete role',
    },
    status: 400,
  },
};

export const responseCreateSuccess: AxiosResponse = {
  data: {
    message: 'Role created successfully',
    data: {
      id: 3,
      name: 'New Role',
      description: 'New role description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  status: 201,
  statusText: 'Created',
  headers: {},
  config: {
    headers: {},
  } as unknown as AxiosResponse['config'],
};

export const responseCreateError = {
  response: {
    data: {
      message: 'Failed to create role',
    },
    status: 400,
  },
};

export const responseUpdateSuccess: AxiosResponse = {
  data: {
    message: 'Role updated successfully',
    data: {
      id: 1,
      name: 'Updated Admin',
      description: 'Updated administrator role',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {},
  } as unknown as AxiosResponse['config'],
};

export const responseUpdateError = {
  response: {
    data: {
      message: 'Failed to update role',
    },
    status: 400,
  },
};
