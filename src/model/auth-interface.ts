import type { IResponseMenu } from "./menu-interface";

export interface IReqLogin {
  email: string;
  password: string;
}

export interface IReqRefreshToken {
  refresh_token: string;
}

export interface IResUserProfile {
  id: number;
  email: string;
  name: string;
  gender: string;
  birthdate: string;
  photo: string | null;
  active: string;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  iat: number;
  exp: number;
}

export interface IResProfile {
  message: string;
  profile: IResUserProfile;
  menu: IResponseMenu[]
}

export interface AppState {
  profileGlobal: IResProfile | null;
}

export interface IResPermission {
  access: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approval: boolean;
  approval_2: boolean;
  approval_3: boolean;
}
