export const responseConfigKeySuccess = {
  data: {
    success: true,
    message: 'Config keys retrieved successfully',
    data: {
      tinymce: {
        api_key: 'a1idauizyuf1o8yisl59r9fghhf2aejxwp0y9udswha8n5hg',
        is_configured: true
      }
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseConfigKeyNotConfigured = {
  data: {
    success: true,
    message: 'Config keys retrieved successfully',
    data: {
      tinymce: {
        api_key: '',
        is_configured: false
      }
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseConfigKeyError = {
  response: {
    data: { message: 'Failed to retrieve config keys' },
    status: 500
  }
};