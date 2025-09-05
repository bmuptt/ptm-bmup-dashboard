export const responseCoreSettingSuccess = {
  data: {
    success: true,
    data: {
      id: 0,
      name: 'PTM BMUP',
      logo: 'http://localhost:8000/storage/logos/logo.jpg',
      description: 'Sistem pengaturan BMUP',
      address: 'Jl. Contoh No. 789, Jakarta Pusat',
      maps: null,
      primary_color: '#f86f24',
      secondary_color: '#efbc37',
      created_at: '2025-08-27T15:08:11.000000Z',
      updated_at: '2025-08-27T19:13:29.000000Z'
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseCoreSettingError = {
  response: {
    data: { message: 'Error occurred' },
    status: 400
  }
};