import type { IRequestRoleMenu } from '@/model/role-menu-interface';
import { api } from '../api';

export const basePath = '/app-management/role-menu';

export function list(id: number) {
  return api({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function add(id: number, data: IRequestRoleMenu[]) {
  return api({
    url: `${basePath}/${id}`,
    method: 'POST',
    data,
  });
}
