import axios from 'axios';
import Swal from 'sweetalert2';
import { createPinia } from 'pinia';
import { useAppStore } from '@/stores/app';
import router from '@/router';
import { tokenManager } from './tokenManager';

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;
const pinia = createPinia();
const store = useAppStore(pinia);

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;

  return config;
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        return await tokenManager.handleTokenRefresh(error, (config) => api(config));
      } catch (refreshError) {
        // Token refresh failed, just reject without logout
        return Promise.reject(refreshError);
      }
    } else if (error.response.status === 403 || error.response.status === 429) {
      // logout()
      //   .then(() => {
      //   })
      //   .catch(() => {});
        store.addProfileGlobal(null);
        localStorage.removeItem('refresh_token');
        router.push('/');
      return new Promise((resolve, reject) => {
        reject(error);
      });
    } else if (error.response.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.errors[0],
        confirmButtonText: 'Ok',
        confirmButtonColor: '#007bff',
      });

      return Promise.reject(error);
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export { api };
