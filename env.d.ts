/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts/client" />
interface Window {
    __ENV__?: {
        VITE_APP_BACKEND_URL?: string;
        VITE_APP_BACKEND_URL_MASTER?: string;
    };
}
  