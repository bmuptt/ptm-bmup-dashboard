export interface IAboutTeamMemberMember {
  id: number;
  name: string;
  username: string;
  photo: string | null;
  active: boolean;
}

export interface IAboutTeamMember {
  id: number;
  member_id: number;
  member?: IAboutTeamMemberMember;
  role: string;
  display_order: number;
  is_published: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface IAboutTeamMembersListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: IAboutTeamMember[];
}

export interface IAboutTeamMemberDetailResponse {
  success: boolean;
  message?: string;
  data: IAboutTeamMember;
}

export interface IAboutTeamMemberUpsertPayload {
  member_id: number;
  role: string;
  is_published: boolean;
}

export interface IAboutTeamMemberUpsertResponse {
  success: boolean;
  message: string;
  data: IAboutTeamMember;
}

export interface IAboutTeamMemberDeleteResponse {
  success: boolean;
  message: string;
}

export interface IAboutTeamMemberSortResponse {
  success: boolean;
  message: string;
}

export interface IRequestAboutTeamMemberForm {
  member_id: number | null;
  role: string;
  is_published: boolean;
}

