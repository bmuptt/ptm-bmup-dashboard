export interface TinyMCEProps {
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
  height?: number;
}

export interface TinyMCEEmits {
  (e: 'update:modelValue', value: string): void;
}
