import { apiMaster } from '@/service/apiSetting';
import type {
  ITrainingScheduleDeleteResponse,
  ITrainingScheduleDetailResponse,
  ITrainingScheduleSortResponse,
  ITrainingScheduleUpsertPayload,
  ITrainingScheduleUpsertResponse,
  ITrainingSchedulesListResponse,
} from '@/model/training-schedule-interface';

const basePath = 'setting/training-schedules';

export const listTrainingSchedules = (params?: { is_published?: boolean }) => {
  return apiMaster.get<ITrainingSchedulesListResponse>(basePath, { params });
};

export const listTrainingSchedulesLanding = () => {
  return apiMaster.get<ITrainingSchedulesListResponse>(`${basePath}/landing`);
};

export const getTrainingScheduleDetail = (id: number) => {
  return apiMaster.get<ITrainingScheduleDetailResponse>(`${basePath}/${id}`);
};

export const createTrainingSchedule = (payload: ITrainingScheduleUpsertPayload) => {
  return apiMaster.post<ITrainingScheduleUpsertResponse>(basePath, payload);
};

export const updateTrainingSchedule = (id: number, payload: ITrainingScheduleUpsertPayload) => {
  return apiMaster.put<ITrainingScheduleUpsertResponse>(`${basePath}/${id}`, payload);
};

export const deleteTrainingSchedule = (id: number) => {
  return apiMaster.delete<ITrainingScheduleDeleteResponse>(`${basePath}/${id}`);
};

export const sortTrainingSchedules = (payload: { ids: string[] }) => {
  return apiMaster.put<ITrainingScheduleSortResponse>(`${basePath}/sort`, payload);
};

