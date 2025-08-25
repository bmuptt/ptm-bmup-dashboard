import type { IDefaultParams } from '@/model/utils-interface';
import { api } from '../api';
import type { IRequestUser, IRequestUserEdit } from '@/model/user-interface';

export const basePath = '/app-management/user';

export function list(params: IDefaultParams) {
  return api({
    url: `${basePath}`,
    method: 'GET',
    params,
  });
}

export function detail(id: number) {
  return api({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function add(data: IRequestUser) {
  return api({
    url: `${basePath}`,
    method: 'POST',
    data,
  });
}

export function update(id: number, data: IRequestUserEdit) {
  return api({
    url: `${basePath}/${id}`,
    method: 'PATCH',
    data
  });
}

export function resetPassword(id: number) {
  return api({
    url: `${basePath}/reset-password/${id}`,
    method: 'POST',
  });
}

export function takeOut(id: number) {
  return api({
    url: `${basePath}/take-out/${id}`,
    method: 'POST',
  });
}
