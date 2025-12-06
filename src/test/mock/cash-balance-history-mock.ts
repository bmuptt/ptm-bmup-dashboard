export const responseHistoryPage1 = {
  data: {
    success: true,
    message: 'ok',
    data: {
      items: [
        {
          id: 3,
          status: true,
          value: 3000,
          description: 'Top up',
          created_by: 1,
          created_at: '2025-11-25T10:00:00.000Z',
          created_by_user: {
            id: 1,
            email: 'john@example.com',
            name: 'John Doe',
            username: 'john',
            role: { id: 1, name: 'Admin' },
            active: 'Active',
            registered_at: '2024-01-01T00:00:00.000Z',
            contact: null,
          },
        },
        {
          id: 2,
          status: false,
          value: 1000,
          description: 'Spend',
          created_by: 1,
          created_at: '2025-11-24T10:00:00.000Z',
          created_by_user: {
            id: 1,
            email: 'john@example.com',
            name: 'John Doe',
            username: 'john',
            role: { id: 1, name: 'Admin' },
            active: 'Active',
            registered_at: '2024-01-01T00:00:00.000Z',
            contact: null,
          },
        },
      ],
      next_cursor: 2,
      has_more: true,
    },
  },
  status: 200,
  statusText: 'OK',
};

export const responseHistoryPage2 = {
  data: {
    success: true,
    message: 'ok',
    data: {
      items: [
        {
          id: 1,
          status: true,
          value: 500,
          description: 'Initial',
          created_by: 99,
          created_at: '2025-11-23T10:00:00.000Z',
          created_by_user: {
            id: 99,
            email: 'system@example.com',
            name: 'System',
            username: 'system',
            role: { id: 2, name: 'System' },
            active: 'Active',
            registered_at: '2020-01-01T00:00:00.000Z',
            contact: null,
          },
        },
      ],
      next_cursor: null,
      has_more: false,
    },
  },
  status: 200,
  statusText: 'OK',
};

