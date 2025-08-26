import type { IAttributeDialogConfirm } from "@/model/utils-interface";

export function useAttributeDialogConfirm({
  title,
  html,
  confirmButtonText = null,
  icon,
  denyButton,
  width,
}: IAttributeDialogConfirm) {
  if (confirmButtonText === null) {
    confirmButtonText = 'Save';
  }

  const data = {
    customClass: {
      denyButton: denyButton ? denyButton : 'btnDeny',
    },
    icon: icon ? (icon as 'success' | 'error' | 'warning' | 'info' | 'question') : undefined,
    title,
    html,
    showDenyButton: true,
    confirmButtonText,
    confirmButtonColor: '#f86f24',
    denyButtonText: `Cancel`,
    denyButtonColor: '#f86f24',
    reverseButtons: true,
    width,
  };

  return data;
}
