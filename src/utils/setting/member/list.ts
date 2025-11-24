import { actionsResponsive, itemsPerPageOptions } from "@/utils/table-utils";
import { format, parseISO } from "date-fns";

export const useTable = (pixel: boolean) => {
  const headers = [
    actionsResponsive(pixel),
    {
      title: "Name",
      sortable: true,
      key: "name",
    },
    {
      title: "Username",
      sortable: false,
      key: "username",
    },
    {
      title: "Gender",
      sortable: false,
      key: "gender",
    },
    {
      title: "Birthdate",
      sortable: false,
      key: "birthdate",
      nowrap: pixel,
      value: (item: Record<string, unknown>) => 
        item.birthdate ? format(parseISO(item.birthdate as string), "yyyy-MM-dd") : "-",
    },
    {
      title: "Phone",
      sortable: false,
      key: "phone",
    },
    {
      title: "Status",
      sortable: false,
      key: "active",
      value: (item: Record<string, unknown>) => 
        item.active ? "Active" : "Inactive",
    },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};
