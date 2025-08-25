import { actionsResponsive, itemsPerPageOptions } from '@/utils/table-utils';

export const useTable = (pixel: boolean) => {
  const headers = [
    actionsResponsive(pixel),
    {
      title: 'Name',
      sortable: true,
      key: 'name',
    },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};
