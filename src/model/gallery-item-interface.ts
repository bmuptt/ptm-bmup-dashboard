export interface IGalleryItem {
  id: number;
  image_url: string;
  title: string;
  display_order: number;
  is_published: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface IGalleryItemsListResponse {
  success: boolean;
  message?: string;
  count: number;
  data: IGalleryItem[];
}

export interface IGalleryItemDetailResponse {
  success: boolean;
  message?: string;
  data: IGalleryItem;
}

export interface IGalleryItemUpsertResponse {
  success: boolean;
  message: string;
  data: IGalleryItem;
}

export interface IGalleryItemDeleteResponse {
  success: boolean;
  message: string;
}

export interface IGalleryItemSortResponse {
  success: boolean;
  message: string;
}

export interface IRequestGalleryItemForm {
  image: File | null;
  title: string;
  is_published: boolean;
  image_url: string | null;
  status_file: '0' | '1';
}
