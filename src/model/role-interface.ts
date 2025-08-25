import type { IDefaultResponse } from './utils-interface';

export interface IRequestRole {
  name: string;
}

export interface IResponseRole extends IDefaultResponse, IRequestRole {}
