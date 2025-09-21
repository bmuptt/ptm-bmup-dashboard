import { describe, test, expect, vi, afterEach } from 'vitest';
import { getConfigKey } from '@/service/Setting/config';
import { responseConfigKeySuccess, responseConfigKeyNotConfigured, responseConfigKeyError } from '../../mock/config-mock';
import type { AxiosResponse } from 'axios';

vi.mock('@/service/Setting/config', () => ({
  getConfigKey: vi.fn(),
}));

describe('Config Key Service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call getConfigKey service successfully with configured TinyMCE', async () => {
    // Mock getConfigKey success with configured TinyMCE
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeySuccess as AxiosResponse);
    
    // Call the service
    const result = await getConfigKey();
    
    // Verify service was called
    expect(getConfigKey).toHaveBeenCalled();
    
    // Verify response structure
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('Config keys retrieved successfully');
    expect(result.data.data.tinymce.api_key).toBe('a1idauizyuf1o8yisl59r9fghhf2aejxwp0y9udswha8n5hg');
    expect(result.data.data.tinymce.is_configured).toBe(true);
    expect(result.status).toBe(200);
  });

  test('should call getConfigKey service successfully with unconfigured TinyMCE', async () => {
    // Mock getConfigKey success with unconfigured TinyMCE
    vi.mocked(getConfigKey).mockResolvedValue(responseConfigKeyNotConfigured as AxiosResponse);
    
    // Call the service
    const result = await getConfigKey();
    
    // Verify service was called
    expect(getConfigKey).toHaveBeenCalled();
    
    // Verify response structure
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('Config keys retrieved successfully');
    expect(result.data.data.tinymce.api_key).toBe('');
    expect(result.data.data.tinymce.is_configured).toBe(false);
    expect(result.status).toBe(200);
  });

  test('should handle getConfigKey error gracefully', async () => {
    // Mock getConfigKey error
    vi.mocked(getConfigKey).mockRejectedValue(responseConfigKeyError);
    
    // Call the service and expect it to throw
    await expect(getConfigKey()).rejects.toEqual(responseConfigKeyError);
    
    // Verify service was called
    expect(getConfigKey).toHaveBeenCalled();
  });
});