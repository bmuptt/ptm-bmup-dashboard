import type { IDefaultResponse } from "./utils-interface";

export interface IRequestBranchEdit {
  code: string;
  name: string;
  alamat: string;
  phone: string;
  pic_id?: number | null;
  status_upload?: number; // 0: no change, 1: new upload, 2: delete existing
}

export interface IRequestBranch extends IRequestBranchEdit {
  logo?: File | null;
}

export interface IResponseBranch extends IRequestBranchEdit, IDefaultResponse {
  logo: string | null;
  pic_id: number | null;
  deleted_by: number | null;
  deleted_by_name: string | null;
  deleted_status: number | null;
  deleted_at: string | null;
}

export interface IStateBranch {
  code: string;
  name: string;
  alamat: string;
  phone: string;
  logo: File | null;
  pic_id: number | null;
  status_upload?: number;
}

export interface IBranchListResponse {
  data: IResponseBranch[];
  links: Record<string, unknown>;
  meta: {
    total?: number;
    [key: string]: unknown;
  };
  total?: number;
}
