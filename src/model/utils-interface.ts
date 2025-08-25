export interface IAttributeDialogConfirm {
  title: string;
  html: string;
  confirmButtonText?: string | null;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  denyButton?: string;
  width?: string | number;
}

export interface IDefaultParams {
  search?: string;
  order_field?: string | null;
  order_dir?: 'asc' | 'desc' | null;
  page: number;
  per_page: number;
}

export interface IParamsList {
  page: number;
  per_page: number;
  search?: string;
  order_field?: string | null;
  order_dir?: string | null;
}

export interface IListResponse<T> {
  data: T[];
  total: number;
}

export interface IDefaultResponse {
  id: number;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
}
