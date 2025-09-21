import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosResponse, AxiosError } from 'axios';
import { tokenManager } from '@/service/tokenManager';
import { refreshToken } from '@/service/auth';

// Mock the auth service
vi.mock('@/service/auth', () => ({
  refreshToken: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TokenRefreshManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenManager.reset();
    localStorageMock.getItem.mockReturnValue('test-refresh-token');
  });

  afterEach(() => {
    tokenManager.reset();
  });

  test('should handle token refresh successfully', async () => {
    const mockRetryRequest = vi.fn().mockResolvedValue({ data: 'success' });
    const mockError = {
      response: { status: 401 },
      config: { url: '/test' },
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 401',
    } as AxiosError;

    const mockRefreshResponse = {
      data: { refresh_token: 'new-refresh-token' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse;

    vi.mocked(refreshToken).mockResolvedValue(mockRefreshResponse);

    const result = await tokenManager.handleTokenRefresh(mockError, mockRetryRequest);

    expect(refreshToken).toHaveBeenCalledWith({
      refresh_token: 'test-refresh-token',
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'new-refresh-token');
    expect(mockRetryRequest).toHaveBeenCalledWith(mockError.config);
    expect(result).toEqual({ data: 'success' });
  });

  test('should handle multiple concurrent 401 requests', async () => {
    const mockRetryRequest = vi.fn().mockResolvedValue({ data: 'success' });
    const mockError = {
      response: { status: 401 },
      config: { url: '/test' },
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 401',
    } as AxiosError;

    const mockRefreshResponse = {
      data: { refresh_token: 'new-refresh-token' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse;

    vi.mocked(refreshToken).mockResolvedValue(mockRefreshResponse);

    // Start first request
    const promise1 = tokenManager.handleTokenRefresh(mockError, mockRetryRequest);
    
    // Start second request while first is still processing
    const promise2 = tokenManager.handleTokenRefresh(mockError, mockRetryRequest);

    const [result1, result2] = await Promise.all([promise1, promise2]);

    // Should only call refreshToken once
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(mockRetryRequest).toHaveBeenCalledTimes(2);
    expect(result1).toEqual({ data: 'success' });
    expect(result2).toEqual({ data: 'success' });
  });

  test('should handle refresh token failure', async () => {
    const mockRetryRequest = vi.fn();
    const mockError = {
      response: { status: 401 },
      config: { url: '/test' },
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 401',
    } as AxiosError;

    const refreshError = new Error('Refresh failed');
    vi.mocked(refreshToken).mockRejectedValue(refreshError);

    await expect(
      tokenManager.handleTokenRefresh(mockError, mockRetryRequest)
    ).rejects.toThrow('Refresh failed');

    expect(refreshToken).toHaveBeenCalledWith({
      refresh_token: 'test-refresh-token',
    });
    expect(mockRetryRequest).not.toHaveBeenCalled();
  });

  test('should not handle non-401 errors', async () => {
    const mockRetryRequest = vi.fn();
    const mockError = {
      response: { status: 403 },
      config: { url: '/test' },
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 403',
    } as AxiosError;

    await expect(
      tokenManager.handleTokenRefresh(mockError, mockRetryRequest)
    ).rejects.toEqual(mockError);

    expect(refreshToken).not.toHaveBeenCalled();
    expect(mockRetryRequest).not.toHaveBeenCalled();
  });

  test('should reset state correctly', () => {
    // This test ensures the reset method works
    expect(() => tokenManager.reset()).not.toThrow();
  });
});
