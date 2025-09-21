import type { IResponseRole } from './role-interface';

export interface DialogRoleSelectionProps {
  modelValue: boolean;
}

export interface DialogRoleSelectionEmits {
  'update:modelValue': [value: boolean];
  'roleSelected': [role: IResponseRole];
}