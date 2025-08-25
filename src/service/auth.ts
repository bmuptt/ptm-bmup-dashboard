import type { IReqLogin, IReqRefreshToken } from '@/model/auth-interface';
import { api } from './api';

export async function login(data: IReqLogin) {
  return api({
    url: `/login`,
    method: 'POST',
    data,
  });
}

export async function refreshToken(data: IReqRefreshToken) {
  return api({
    url: `/refresh-token`,
    method: 'POST',
    data
  })
}

export function profile() {
  return api({
    url: `/profile`,
  })
}

export function getPermission(params: { key_menu: string }) {
  return api({
    url: `/permission`,
    params
  })
}

export function logout() {
  return api({
    url: `/logout`,
    method: 'POST',
  })
}
