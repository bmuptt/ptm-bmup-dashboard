import axios from 'axios';
import Swal from 'sweetalert2';
import { createPinia } from 'pinia';
import { useAppStore } from '@/stores/app';
import router from '@/router';
import { tokenManager } from './tokenManager';

const baseUrlFinance = import.meta.env.VITE_APP_BACKEND_URL_FINANCE;
const pinia = createPinia();
const store = useAppStore(pinia);

const apiFinance = axios.create({
  baseURL: `${baseUrlFinance}/api`,
});

apiFinance.interceptors.request.use((config) => {
  config.withCredentials = true;

  return config;
});

apiFinance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        return await tokenManager.handleTokenRefresh(error, (config) => apiFinance(config));
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } else if (error.response.status === 403 || error.response.status === 429) {
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

export { apiFinance };

