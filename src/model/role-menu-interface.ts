export interface IRequestRoleMenu {
  menu_id: number;
  access: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  approval?: boolean;
  approval_2?: boolean;
  approval_3?: boolean;
}

export interface IPermissions {
  access: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approval: boolean;
  approval_2: boolean;
  approval_3: boolean;
}

export interface IResponseRoleMenu {
  id: number;
  key_menu: string;
  name: string;
  url: string | null;
  order_number: number;
  active: string;
  permissions: IPermissions;
  children: IResponseRoleMenu[];
  menu_id: number | null;
}

export interface IResTreeMenu {
  id: number;
  permissions: {
    access: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    approval: boolean;
    approval_2: boolean;
    approval_3: boolean;
  };
  children?: IResTreeMenu[];
}