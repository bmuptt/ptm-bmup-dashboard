import { apiMaster } from '@/service/apiSetting';
import type {
  IGalleryItemDeleteResponse,
  IGalleryItemDetailResponse,
  IGalleryItemSortResponse,
  IGalleryItemUpsertResponse,
  IGalleryItemsListResponse,
} from '@/model/gallery-item-interface';

const basePath = 'setting/gallery-items';

export const listGalleryItems = (params?: { is_published?: boolean }) => {
  return apiMaster.get<IGalleryItemsListResponse>(basePath, { params });
};

export const listGalleryItemsLanding = () => {
  return apiMaster.get<IGalleryItemsListResponse>(`${basePath}/landing`);
};

export const getGalleryItemDetail = (id: number) => {
  return apiMaster.get<IGalleryItemDetailResponse>(`${basePath}/${id}`);
};

export const createGalleryItem = (payload: FormData) => {
  return apiMaster.post<IGalleryItemUpsertResponse>(basePath, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateGalleryItem = (id: number, payload: FormData) => {
  return apiMaster.post<IGalleryItemUpsertResponse>(`${basePath}/${id}?_method=PUT`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteGalleryItem = (id: number) => {
  return apiMaster.delete<IGalleryItemDeleteResponse>(`${basePath}/${id}`);
};

export const sortGalleryItems = (payload: { ids: string[] }) => {
  return apiMaster.put<IGalleryItemSortResponse>(`${basePath}/sort`, payload);
};

