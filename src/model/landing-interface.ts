export interface ILandingItem {
  id: number;
  key: string;
  type: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  button_label: string | null;
  button_url: string | null;
  published: boolean;
}

export interface ILandingSectionMeta {
  id: number;
  page_key: string;
}

export interface ILandingSectionWithItems {
  section: ILandingSectionMeta;
  items: ILandingItem[];
}

export interface ILandingSingleSectionResponse {
  success: boolean;
  data: {
    section: ILandingSectionMeta;
    items: ILandingItem[];
  };
  message?: string;
}

export interface ILandingSectionsResponse {
  success: boolean;
  data: ILandingSectionWithItems[];
  message?: string;
}

export interface IUpsertLandingItemPayload {
  key: string;
  type: string;
  title?: string | null;
  content?: string | null;
  button_label?: string | null;
  button_url?: string | null;
  published: boolean;
  status_image?: '0' | '1';
}

export interface IUpsertLandingSectionPayload {
  page_key: string;
  items: IUpsertLandingItemPayload[];
}

export interface IUpsertLandingRequestPayload {
  sections: IUpsertLandingSectionPayload[];
}

