export const responseCashBalanceSuccess = {
  data: {
    success: true,
    message: 'Cash balance updated successfully',
    data: {
      balance: 800.25,
    },
  },
  status: 200,
  statusText: 'OK',
};

export const responseCashBalanceError = {
  response: {
    data: { message: 'Error updating cash balance' },
    status: 400,
  },
};

