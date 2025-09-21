export interface TinyMCEProps {
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
  height?: number;
}

export interface TinyMCEEmits {
  (e: 'update:modelValue', value: string): void;
}

export interface ITinyMCEConfig {
  api_key: string;
  is_configured: boolean;
}

export interface IConfigKeyResponse {
  success: boolean;
  message: string;
  data: {
    tinymce: ITinyMCEConfig;
  };
}
