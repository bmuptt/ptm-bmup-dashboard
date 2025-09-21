import type { AxiosError, AxiosRequestConfig } from 'axios';
import { refreshToken } from './auth';

class TokenRefreshManager {
  private isRefreshing = false;
  private failedQueue: (() => void)[] = [];

  async handleTokenRefresh(error: AxiosError, retryRequest: (config: AxiosRequestConfig) => Promise<unknown>) {
    if (error.response?.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        const data = {
          refresh_token: localStorage.getItem('refresh_token') ?? '',
        };

        try {
          const { data: { refresh_token } } = await refreshToken(data);
          localStorage.setItem('refresh_token', refresh_token);
          this.isRefreshing = false;

          // Retry all failed requests
          if (this.failedQueue.length > 0) {
            const requests = this.failedQueue;
            this.failedQueue = [];

            requests.forEach((callback) => {
              callback();
            });
          }

          return retryRequest(error.config!);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.failedQueue = [];
          throw refreshError;
        }
      } else {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          this.failedQueue.push(() => {
            resolve(retryRequest(error.config!));
          });
        });
      }
    }
    
    throw error;
  }

  reset() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }
}

// Export singleton instance
export const tokenManager = new TokenRefreshManager();
