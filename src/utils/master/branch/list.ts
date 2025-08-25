import { actionsResponsive, itemsPerPageOptions } from "@/utils/table-utils";

export const useTable = (pixel: boolean) => {
  const headers = [
    actionsResponsive(pixel),
    {
      title: "Code",
      sortable: true,
      key: "code",
    },
    {
      title: "Name",
      sortable: true,
      key: "name",
    },
    {
      title: "Address",
      sortable: true,
      key: "alamat",
    },
    {
      title: "Phone",
      sortable: true,
      key: "phone",
    },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};
