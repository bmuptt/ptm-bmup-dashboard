export interface ITrainingScheduleMember {
  id: number;
  name: string;
  username: string;
  photo: string | null;
  active: boolean;
}

export interface ITrainingSchedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  category: string;
  member_id: number | null;
  display_order: number;
  is_published: boolean;
  member?: ITrainingScheduleMember;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface ITrainingSchedulesListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: ITrainingSchedule[];
}

export interface ITrainingScheduleDetailResponse {
  success: boolean;
  message?: string;
  data: ITrainingSchedule;
}

export interface ITrainingScheduleUpsertPayload {
  day_of_week: number;
  start_time: string;
  end_time: string;
  category: string;
  member_id: number | null;
  is_published: boolean;
}

export interface ITrainingScheduleUpsertResponse {
  success: boolean;
  message: string;
  data: ITrainingSchedule;
}

export interface ITrainingScheduleDeleteResponse {
  success: boolean;
  message: string;
}

export interface ITrainingScheduleSortResponse {
  success: boolean;
  message: string;
}

export interface IRequestTrainingScheduleForm {
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  category: string;
  member_id: number | null;
  is_published: boolean;
}

