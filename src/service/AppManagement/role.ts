import type { IDefaultParams } from '@/model/utils-interface';
import { api } from '../api';
import type { IRequestRole } from '@/model/role-interface';

export const basePath = '/app-management/role';

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

export function add(data: IRequestRole) {
  return api({
    url: `${basePath}`,
    method: 'POST',
    data,
  });
}

export function update(id: number, data: IRequestRole) {
  return api({
    url: `${basePath}/${id}`,
    method: 'PATCH',
    data,
  });
}

export function deleteData(id: number) {
  return api({
    url: `${basePath}/${id}`,
    method: 'DELETE',
  });
}
