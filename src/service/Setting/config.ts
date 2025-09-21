import { apiMaster } from '@/service/apiSetting';
import type { IConfigKeyResponse } from '@/model/tinymce-interface';

export const basePath = 'setting/config-key';

export const getConfigKey = () => {
  return apiMaster.get<IConfigKeyResponse>(basePath);
};