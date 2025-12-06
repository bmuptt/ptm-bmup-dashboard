import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getCashBalanceHistory } from '@/service/Finance/cashBalance';
import type { AxiosResponse } from 'axios';
import type { ICashBalanceHistoryResponse } from '@/model/finance-interface';

vi.mock('@/service/apiFinance', () => ({
  apiFinance: vi.fn(),
}));

import { apiFinance } from '@/service/apiFinance';

describe('Finance Service: getCashBalanceHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls endpoint with provided limit and cursor', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          items: [],
          next_cursor: null,
          has_more: false,
        },
      },
    };

    vi.mocked(apiFinance).mockResolvedValue(mockResponse as unknown as AxiosResponse<ICashBalanceHistoryResponse>);

    const result = await getCashBalanceHistory({ limit: 5, cursor: 2 });

    expect(apiFinance).toHaveBeenCalledWith({
      url: 'finance/cash-balance/history',
      method: 'GET',
      params: { limit: 5, cursor: 2 },
    });
    expect(result).toEqual(mockResponse);
  });

  test('uses default limit=10 and omits cursor when not provided', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          items: [],
          next_cursor: null,
          has_more: false,
        },
      },
    };

    vi.mocked(apiFinance).mockResolvedValue(mockResponse as unknown as AxiosResponse<ICashBalanceHistoryResponse>);

    const result = await getCashBalanceHistory();

    expect(apiFinance).toHaveBeenCalledWith({
      url: 'finance/cash-balance/history',
      method: 'GET',
      params: { limit: 10 },
    });
    expect(result).toEqual(mockResponse);
  });

  test('propagates error correctly', async () => {
    const mockError = new Error('network');
    vi.mocked(apiFinance).mockRejectedValue(mockError);

    await expect(getCashBalanceHistory({ limit: 3 })).rejects.toThrow('network');
  });
});

