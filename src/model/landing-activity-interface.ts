export interface ILandingIcon {
  id: number;
  name: string;
  label: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ILandingActivity {
  id: number;
  icon_id: number;
  title: string;
  subtitle: string;
  is_published: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  icon?: ILandingIcon;
}

export interface ILandingActivitiesListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: ILandingActivity[];
}

export interface ILandingActivityDetailResponse {
  success: boolean;
  message?: string;
  data: ILandingActivity;
}

export interface ILandingActivityUpsertResponse {
  success: boolean;
  message: string;
  data: ILandingActivity;
}

export interface ILandingActivityDeleteResponse {
  success: boolean;
  message: string;
}

export interface ILandingActivitySortResponse {
  success: boolean;
  message: string;
}

export interface ILandingIconsListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: ILandingIcon[];
}

export interface IRequestLandingActivity {
  icon_id: number | null;
  title: string;
  subtitle: string;
  is_published: boolean;
}

export interface ILandingActivityUpsertPayload {
  icon_id: string;
  title: string;
  subtitle: string;
  is_published: boolean;
}
