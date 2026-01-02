import { apiMaster } from '@/service/apiSetting';
import type {
  IAboutTeamMemberDeleteResponse,
  IAboutTeamMemberDetailResponse,
  IAboutTeamMembersListResponse,
  IAboutTeamMemberSortResponse,
  IAboutTeamMemberUpsertPayload,
  IAboutTeamMemberUpsertResponse,
} from '@/model/about-team-member-interface';

const basePath = 'setting/about-team-members';

export const listAboutTeamMembers = (params?: { is_published?: boolean }) => {
  return apiMaster.get<IAboutTeamMembersListResponse>(basePath, { params });
};

export const getAboutTeamMemberDetail = (id: number) => {
  return apiMaster.get<IAboutTeamMemberDetailResponse>(`${basePath}/${id}`);
};

export const createAboutTeamMember = (payload: IAboutTeamMemberUpsertPayload) => {
  return apiMaster.post<IAboutTeamMemberUpsertResponse>(basePath, payload);
};

export const updateAboutTeamMember = (id: number, payload: IAboutTeamMemberUpsertPayload) => {
  return apiMaster.put<IAboutTeamMemberUpsertResponse>(`${basePath}/${id}`, payload);
};

export const deleteAboutTeamMember = (id: number) => {
  return apiMaster.delete<IAboutTeamMemberDeleteResponse>(`${basePath}/${id}`);
};

export const sortAboutTeamMembers = (payload: { ids: string[] }) => {
  return apiMaster.put<IAboutTeamMemberSortResponse>(`${basePath}/sort`, payload);
};

