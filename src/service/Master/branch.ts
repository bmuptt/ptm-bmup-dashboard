import type { IDefaultParams } from "@/model/utils-interface";
import type { IResponseBranch, IBranchListResponse } from "@/model/branch-interface";
import { apiMaster } from "../apiMaster";

export const basePath = '/master/branch';

export function list(params: IDefaultParams) {
  return apiMaster<IBranchListResponse>({
    url: `${basePath}`,
    method: 'GET',
    params,
  });
}

export function show(id: number) {
  return apiMaster<IResponseBranch>({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function store(data: FormData) {
  return apiMaster<{ data: IResponseBranch; message: string }>({
    url: `${basePath}`,
    method: 'POST',
    data,
    transformRequest: [function (data) {
      return data; // Don't transform FormData
    }],
  });
}

export function update(id: number, data: FormData) {
  // Add _method: 'PUT' to FormData for Laravel method spoofing
  data.append('_method', 'PUT');
  
  return apiMaster<{ data: IResponseBranch; message: string }>({
    url: `${basePath}/${id}`,
    method: 'POST',
    data,
    transformRequest: [function (data) {
      return data; // Don't transform FormData
    }],
  });
}

export function destroy(id: number) {
  return apiMaster<{ message: string; deleted_branch: IResponseBranch }>({
    url: `${basePath}/${id}`,
    method: 'DELETE',
  });
}