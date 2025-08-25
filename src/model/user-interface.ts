import type { IResponseRole } from "./role-interface";
import type { IDefaultResponse } from "./utils-interface";

export interface IRequestUserEdit {
  name: string;
  gender: string;
  birthdate: string;
}

export interface IRequestUser extends IRequestUserEdit {
  email: string;
}

export interface IResponseUser extends IRequestUser, IDefaultResponse {
  password: string;
  photo: string | null;
  active: string;
}

export interface IStateUser {
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  role: IResponseRole | null;
}
