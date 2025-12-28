import { apiMaster } from '@/service/apiSetting';
import type {
  ILandingSectionsResponse,
  ILandingSingleSectionResponse,
  IUpsertLandingRequestPayload,
} from '@/model/landing-interface';

const basePath = 'setting/landing';

export const getLandingSections = () => {
  return apiMaster.get<ILandingSectionsResponse>(`${basePath}/sections`);
};

export const getLandingSectionByPageKey = (pageKey: string) => {
  return apiMaster.get<ILandingSingleSectionResponse>(`${basePath}/sections/${pageKey}`);
};

export const upsertLandingItems = (payload: IUpsertLandingRequestPayload, images: Record<string, File | null>) => {
  const formData = new FormData();

  payload.sections.forEach((section, sectionIndex) => {
    formData.append(`sections[${sectionIndex}][page_key]`, section.page_key);

    section.items.forEach((item, itemIndex) => {
      formData.append(`sections[${sectionIndex}][items][${itemIndex}][key]`, item.key);
      formData.append(`sections[${sectionIndex}][items][${itemIndex}][type]`, item.type);
      if (item.title !== null && item.title !== undefined) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][title]`, item.title);
      }
      if (item.content !== null && item.content !== undefined) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][content]`, item.content);
      }
      if (item.button_label !== null && item.button_label !== undefined) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][button_label]`, item.button_label);
      }
      if (item.button_url !== null && item.button_url !== undefined) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][button_url]`, item.button_url);
      }
      formData.append(`sections[${sectionIndex}][items][${itemIndex}][published]`, String(item.published));

      if (item.status_image) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][status_image]`, item.status_image);
      }

      const file = images[item.key];
      if (file) {
        formData.append(`sections[${sectionIndex}][items][${itemIndex}][image]`, file);
      }
    });
  });

  return apiMaster.post<ILandingSectionsResponse>(`${basePath}/items?_method=PUT`, formData);
};

