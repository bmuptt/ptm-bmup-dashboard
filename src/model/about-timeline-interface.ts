export interface IAboutTimeline {
  id: number;
  year: number;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface IAboutTimelineListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: IAboutTimeline[];
}

export interface IAboutTimelineDetailResponse {
  success: boolean;
  message?: string;
  data: IAboutTimeline;
}

export interface IAboutTimelineUpsertPayload {
  year: number;
  title: string;
  description: string;
  is_published: boolean;
}

export interface IAboutTimelineUpsertResponse {
  success: boolean;
  message: string;
  data: IAboutTimeline;
}

export interface IAboutTimelineDeleteResponse {
  success: boolean;
  message: string;
}

export interface IRequestAboutTimelineForm {
  year: number | null;
  title: string;
  description: string;
  is_published: boolean;
}

