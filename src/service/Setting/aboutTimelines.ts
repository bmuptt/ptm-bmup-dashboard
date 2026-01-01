import { apiMaster } from '@/service/apiSetting';
import type {
  IAboutTimelineDeleteResponse,
  IAboutTimelineDetailResponse,
  IAboutTimelineListResponse,
  IAboutTimelineUpsertPayload,
  IAboutTimelineUpsertResponse,
} from '@/model/about-timeline-interface';

const basePath = 'setting/about-timelines';

export const listAboutTimelines = (params?: { is_published?: boolean }) => {
  return apiMaster.get<IAboutTimelineListResponse>(basePath, { params });
};

export const getAboutTimelineDetail = (id: number) => {
  return apiMaster.get<IAboutTimelineDetailResponse>(`${basePath}/${id}`);
};

export const createAboutTimeline = (payload: IAboutTimelineUpsertPayload) => {
  return apiMaster.post<IAboutTimelineUpsertResponse>(basePath, payload);
};

export const updateAboutTimeline = (id: number, payload: IAboutTimelineUpsertPayload) => {
  return apiMaster.put<IAboutTimelineUpsertResponse>(`${basePath}/${id}`, payload);
};

export const deleteAboutTimeline = (id: number) => {
  return apiMaster.delete<IAboutTimelineDeleteResponse>(`${basePath}/${id}`);
};

