import type { IDefaultResponse } from "./utils-interface";

export interface IResponseMember extends IDefaultResponse {
  user_id: number | null;
  name: string;
  username: string;
  gender: string;
  birthdate: string;
  address: string;
  phone: string;
  photo: string | null;
  active: boolean;
  has_user_account: boolean;
}

export interface IRequestMember {
  name: string;
  username: string;
  gender: string;
  birthdate: string;
  address: string;
  phone: string;
  photo: File | null;
  status_photo: string;
  active: boolean;
}

export interface IRequestMemberEdit {
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  phone: string;
  photo: File | null;
  status_photo: string;
}

export interface IRequestCreateUser {
  email: string;
  role_id: number;
}
