import { apiMaster } from '@/service/apiSetting';
import type { ICoreSettingResponse, ICoreSettingForm } from '@/model/core-setting-interface';

export const basePath = 'setting/core';

export const getCoreSetting = () => {
  return apiMaster.get<ICoreSettingResponse>(basePath);
};

export const updateCoreSetting = (data: ICoreSettingForm) => {
  const formData = new FormData();
  
  formData.append('_method', 'PATCH');
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('address', data.address);
  formData.append('maps', data.maps || '');
  formData.append('primary_color', data.primary_color);
  formData.append('secondary_color', data.secondary_color);
  formData.append('status_logo', data.status_logo);
  
  if (data.logo) {
    formData.append('logo', data.logo);
  }

  return apiMaster.post<ICoreSettingResponse>(basePath, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
