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
