import { apiMaster } from '@/service/apiSetting';
import type { ILandingIconsListResponse } from '@/model/landing-activity-interface';

const basePath = 'setting/landing';

export const listLandingIcons = () => {
  return apiMaster.get<ILandingIconsListResponse>(`${basePath}/icons`);
};
