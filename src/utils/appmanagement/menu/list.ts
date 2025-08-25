import { actionsResponsive, itemsPerPageOptions } from '@/utils/table-utils';

export const useTable = (pixel: boolean) => {
  const headers = [
    actionsResponsive(pixel),
    {
      title: 'Key Menu',
      sortable: true,
      key: 'key_menu',
    },
    {
      title: 'Name',
      sortable: true,
      key: 'name',
      nowrap: pixel
    },
    {
      title: 'URL',
      key: 'url',
      sortable: false,
      nowrap: pixel
    },
    {
      title: 'Active',
      sortable: true,
      key: 'active',
    },
    {
      title: 'Count Submenu',
      key: 'children',
      sortable: false,
      value: (item: Record<string, unknown>) => Array.isArray(item.children) ? item.children.length : 0,
    },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};
