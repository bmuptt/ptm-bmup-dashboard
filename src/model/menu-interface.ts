import type { IDefaultResponse } from "./utils-interface";

export interface IMenu {
  key_menu: string;
  name: string;
  url?: string | null;
}

export interface IRequestMenu extends IMenu {
  menu_id?: number | null;
}

export interface IRequestMenuSort {
  list_menu: IDefaultResponse[];
}

export interface IRequestMenuChangeParent {
  menu_id: number | null;
}

export interface IResponseMenu extends IDefaultResponse, IRequestMenu {
    active: string;
    order_number: number;
    children: IResponseMenu[];
}
