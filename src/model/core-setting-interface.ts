export interface ICoreSetting {
  id: number;
  name: string;
  logo: string;
  description: string;
  address: string;
  maps: string | null;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

export interface ICoreSettingResponse {
  success: boolean;
  data: ICoreSetting;
  message?: string;
}

export interface ICoreSettingForm {
  name: string;
  logo?: File | null;
  description: string;
  address: string;
  maps: string | null;
  primary_color: string;
  secondary_color: string;
  status_logo: string;
}

