export interface ITipTapProps {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  hideToolbar?: boolean;
}

export interface ITipTapEmits {
  'update:modelValue': (value: string) => void;
  'change': (value: string) => void;
}
