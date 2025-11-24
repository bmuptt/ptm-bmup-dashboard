import type { IDefaultParams } from '@/model/utils-interface';
import type { IRequestCreateUser } from '@/model/member-interface';
import { apiMaster } from '../apiSetting';

export const basePath = 'setting/members';

export function list(params: IDefaultParams & { active?: string }) {
  // Remove active parameter if it's empty string (All)
  const cleanParams = { ...params };
  if (cleanParams.active === '') {
    delete cleanParams.active;
  }
  
  return apiMaster({
    url: basePath,
    method: 'GET',
    params: cleanParams,
  });
}

export function detail(id: number) {
  return apiMaster({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function add(data: FormData) {
  return apiMaster({
    url: basePath,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function update(id: number, data: FormData) {
  return apiMaster({
    url: `${basePath}/${id}?_method=PUT`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteData(id: number) {
  return apiMaster({
    url: `${basePath}/${id}`,
    method: 'DELETE',
  });
}

export function createUser(id: number, data: IRequestCreateUser) {
  return apiMaster({
    url: `${basePath}/create-user/${id}`,
    method: 'POST',
    data,
  });
}
