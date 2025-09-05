export interface ConfirmDialogProps {
  modelValue: boolean;
  title: string;
  html: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export interface ConfirmDialogEmits {
  'update:modelValue': [value: boolean];
  'confirm': [];
  'cancel': [];
}
