export const actionsResponsive = (fixed = true) => ({
  title: 'Actions',
  align: "center" as "start" | "center" | "end",
  sortable: false,
  key: 'actions',
  fixed,
});

export const itemsPerPageOptions = [10, 25, 50, 100];
