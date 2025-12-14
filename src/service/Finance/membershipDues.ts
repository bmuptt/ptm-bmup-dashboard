import type {
  IGetMembershipDuesParams,
  IMembershipDuesResponse,
  IUpdateMembershipDuesRequest,
  IUploadMembershipDuesProofRequest,
  IUploadMembershipDuesProofResponse,
  IMembershipDuesDetailResponse,
} from '@/model/finance-interface';
import { apiFinance } from '../apiFinance';
import type { IImportMembershipDuesResponse } from '@/model/finance-interface';

const basePath = 'finance/dues';

export function getMembershipDues(params?: IGetMembershipDuesParams) {
  return apiFinance<IMembershipDuesResponse>({
    url: basePath,
    method: 'GET',
    params,
  });
}

export function updateMembershipDues(data: IUpdateMembershipDuesRequest) {
  return apiFinance<void>({
    url: basePath,
    method: 'POST',
    data,
  });
}

export function uploadMembershipDuesProof(
  id: number,
  payload: IUploadMembershipDuesProofRequest
) {
  const formData = new FormData();
  formData.append('status_file', String(payload.status_file));
  if (payload.proof_file) {
    formData.append('proof_file', payload.proof_file);
  }

  return apiFinance<{ data: IUploadMembershipDuesProofResponse }>({
    url: `${basePath}/${id}/proof`,
    method: 'PUT',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getMembershipDuesProof(id: number) {
  return apiFinance<{ data: IUploadMembershipDuesProofResponse }>({
    url: `${basePath}/${id}/proof`,
    method: 'GET',
  });
}

export function getMembershipDuesDetail(id: number) {
  return apiFinance<IMembershipDuesDetailResponse>({
    url: `${basePath}/${id}`,
    method: 'GET',
  });
}

export function importMembershipDues(period_year: number, file: File) {
  const formData = new FormData();
  formData.append('period_year', String(period_year));
  formData.append('file', file);

  return apiFinance<IImportMembershipDuesResponse>({
    url: `${basePath}/import`,
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
