import { itemsPerPageOptions } from '@/utils/table-utils';

export const useTable = () => {
  const headers = [
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};