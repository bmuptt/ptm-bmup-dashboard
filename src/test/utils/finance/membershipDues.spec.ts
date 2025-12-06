import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getMembershipDues } from '@/service/Finance/membershipDues';
import type { AxiosResponse } from 'axios';
import type { IMembershipDuesResponse } from '@/model/finance-interface';

vi.mock('@/service/apiFinance', () => ({
  apiFinance: vi.fn(),
}));

import { apiFinance } from '@/service/apiFinance';

describe('Finance Service: Membership Dues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMembershipDues', () => {
    test('calls endpoint with params', async () => {
      const mockResponse = {
        data: {
          items: [],
          meta: { nextCursor: null, hasMore: false, limit: 10 },
        },
      };

      vi.mocked(apiFinance).mockResolvedValue(mockResponse as unknown as AxiosResponse<IMembershipDuesResponse>);

      const params = { limit: 10, period_year: 2025, cursor: 5 };
      const result = await getMembershipDues(params);

      expect(apiFinance).toHaveBeenCalledWith({
        url: 'finance/dues',
        method: 'GET',
        params,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});