import type { ICashBalanceResponse, IUpdateCashBalanceRequest, ICashBalanceHistoryResponse, IGetCashBalanceHistoryParams } from '@/model/finance-interface';
import { apiFinance } from '../apiFinance';

const basePath = 'finance/cash-balance';

export function getCashBalance() {
  return apiFinance<ICashBalanceResponse>({
    url: basePath,
    method: 'GET',
  });
}

export function updateCashBalance(data: IUpdateCashBalanceRequest) {
  return apiFinance<ICashBalanceResponse>({
    url: basePath,
    method: 'PUT',
    data,
  });
}

export function getCashBalanceHistory(params?: IGetCashBalanceHistoryParams) {
  const query = {
    limit: params?.limit ?? 10,
    ...(params?.cursor ? { cursor: params.cursor } : {}),
  };

  return apiFinance<ICashBalanceHistoryResponse>({
    url: `${basePath}/history`,
    method: 'GET',
    params: query,
  });
}
