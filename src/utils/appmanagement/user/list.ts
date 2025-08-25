import { actionsResponsive, itemsPerPageOptions } from "@/utils/table-utils";
import { format, parseISO } from "date-fns";

export const useTable = (pixel: boolean) => {
  const headers = [
    actionsResponsive(pixel),
    {
      title: "Email",
      sortable: true,
      key: "email",
    },
    {
      title: "Name",
      sortable: true,
      key: "name",
    },
    {
      title: "Gender",
      sortable: true,
      key: "gender",
    },
    {
      title: "Birthdate",
      sortable: true,
      key: "birthdate",
      nowrap: pixel,
      value: (item: Record<string, unknown>) => 
        item.birthdate ? format(parseISO(item.birthdate as string), "yyyy-MM-dd") : "-",
    },
    {
      title: "Status",
      sortable: true,
      key: "active",
    },
  ];

  return {
    headers,
    itemsPerPageOptions,
  };
};
