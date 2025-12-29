import { apiMaster } from '@/service/apiSetting';
import type {
  ILandingActivitiesListResponse,
  ILandingActivityDeleteResponse,
  ILandingActivityDetailResponse,
  ILandingActivitySortResponse,
  ILandingActivityUpsertPayload,
  ILandingActivityUpsertResponse,
} from '@/model/landing-activity-interface';

const basePath = 'setting/landing';

export const listLandingActivities = () => {
  return apiMaster.get<ILandingActivitiesListResponse>(`${basePath}/activities`);
};

export const getLandingActivityDetail = (id: number) => {
  return apiMaster.get<ILandingActivityDetailResponse>(`${basePath}/activities/${id}`);
};

export const createLandingActivity = (payload: ILandingActivityUpsertPayload) => {
  return apiMaster.post<ILandingActivityUpsertResponse>(`${basePath}/activities`, payload);
};

export const updateLandingActivity = (id: number, payload: ILandingActivityUpsertPayload) => {
  return apiMaster.put<ILandingActivityUpsertResponse>(`${basePath}/activities/${id}`, payload);
};

export const deleteLandingActivity = (id: number) => {
  return apiMaster.delete<ILandingActivityDeleteResponse>(`${basePath}/activities/${id}`);
};

export const sortLandingActivities = (payload: { ids: string[] }) => {
  return apiMaster.put<ILandingActivitySortResponse>(`${basePath}/activities/sort`, payload);
};
