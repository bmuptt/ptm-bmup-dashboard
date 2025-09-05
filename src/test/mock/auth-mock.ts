import { AxiosHeaders } from 'axios';

export const responseRejectLogin = {
  response: {
    data: {
      errors: ['Email or password is incorrect!'],
    },
  },
};

export const responseResolvedLogin = {
  data: {
    message: 'Login successful',
    refresh_token: 'tokenrefreshrandom',
    user: {
      id: 1,
      email: 'admin@tes.com',
      name: 'Admin',
      gender: 'Male',
      birthdate: '2001-01-01T00:00:00.000Z',
      photo: null,
      active: 'Active',
      created_by: 0,
      created_at: '2025-02-03T00:32:27.037Z',
      updated_by: null,
      updated_at: '2025-02-03T00:32:27.037Z',
    },
  },
  status: 200, // Status code untuk success
  statusText: 'OK',
  headers: {}, // Header respons (bisa kosong jika tidak diperlukan)
  config: {
    headers: new AxiosHeaders(), // Gunakan AxiosHeaders
    url: '/login',
    method: 'post',
  },
};

export const responseProfileSuccess = {
  data: {
    success: true,
    data: {
      profile: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        birthdate: '1990-01-01T00:00:00.000Z',
        photo: null,
        active: 'Active',
        created_by: 0,
        created_at: '2025-02-03T00:32:27.037Z',
        updated_by: null,
        updated_at: '2025-02-03T00:32:27.037Z',
      },
      menu: [
        {
          id: 1,
          name: 'Dashboard',
          icon: 'mdi-view-dashboard',
          url: '/dashboard',
          children: [],
        },
      ],
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
    url: '/profile',
    method: 'get',
  },
};

export const responseProfileError = {
  response: {
    data: {
      message: 'Profile not found',
    },
    status: 404,
  },
};

export const responseLogoutSuccess = {
  data: {
    message: 'Logout successful',
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
    url: '/logout',
    method: 'post',
  },
};

export const responseLogoutError = {
  response: {
    data: {
      message: 'Logout failed',
    },
    status: 500,
  },
};

export const responsePermissionSuccess = {
  data: {
    data: {
      create: true,
      update: true,
      delete: true,
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
    url: '/permission',
    method: 'get',
  },
};

export const responsePermissionError = {
  response: {
    data: {
      message: 'Permission denied',
    },
    status: 403,
  },
};