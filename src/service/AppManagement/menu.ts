import type { IRequestMenu, IRequestMenuChangeParent, IRequestMenuSort } from '@/model/menu-interface';
import { api } from '../api';
import type { IDefaultParams } from '@/model/utils-interface';

const basePath = '/app-management/menu';

export function list(id: number) {
  return api({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function detail(id: number) {
  return api({
    url: `${basePath}/${id}/detail`,
    method: 'GET',
  });
}

export function listHeader(id: number, params: IDefaultParams) {
  return api({
    url: `${basePath}/${id}/list-header`,
    params,
    method: 'GET',
  });
}

export function structure() {
  return api({
    url: `${basePath}-structure`,
    method: 'GET',
  });
}

export function add(data: IRequestMenu) {
  return api({
    url: `${basePath}`,
    method: 'POST',
    data,
  });
}

export function sort(id: number, data: IRequestMenuSort) {
  return api({
    url: `${basePath}/sort/${id}`,
    method: 'POST',
    data,
  });
}

export function changeParent(id: number, data: IRequestMenuChangeParent) {
  return api({
    url: `${basePath}/change-parent/${id}`,
    method: 'POST',
    data,
  });
}

export function update(id: number, data: IRequestMenu) {
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

export function activeMenu(id: number) {
  return api({
    url: `${basePath}/active/${id}`,
    method: 'PUT',
  });
}
