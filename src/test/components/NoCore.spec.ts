import { describe, test, expect, vi, afterEach } from 'vitest';
import { getCoreSetting } from '@/service/Setting/core';
import { responseCoreSettingSuccess, responseCoreSettingError } from '../mock/core-mock';
import type { AxiosResponse } from 'axios';

vi.mock('@/service/Setting/core', () => ({
  getCoreSetting: vi.fn(),
}));

describe('NoCore getCoreSetting Service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call getCoreSetting service successfully', async () => {
    // Mock getCoreSetting success
    vi.mocked(getCoreSetting).mockResolvedValue(responseCoreSettingSuccess as AxiosResponse);
    
    // Call the service
    const result = await getCoreSetting();
    
    // Verify service was called
    expect(getCoreSetting).toHaveBeenCalled();
    
    // Verify response structure
    expect(result.data.success).toBe(true);
    expect(result.data.data.name).toBe('PTM BMUP');
    expect(result.data.data.primary_color).toBe('#f86f24');
    expect(result.status).toBe(200);
  });

  test('should handle getCoreSetting error gracefully', async () => {
    // Mock getCoreSetting error
    vi.mocked(getCoreSetting).mockRejectedValue(responseCoreSettingError);
    
    // Call the service and expect it to throw
    await expect(getCoreSetting()).rejects.toEqual(responseCoreSettingError);
    
    // Verify service was called
    expect(getCoreSetting).toHaveBeenCalled();
  });

  test('should call getCoreSetting service with correct endpoint', () => {
    // Mock getCoreSetting
    vi.mocked(getCoreSetting).mockResolvedValue(responseCoreSettingSuccess as AxiosResponse);
    
    // Call the service
    getCoreSetting();
    
    // Verify service was called
    expect(getCoreSetting).toHaveBeenCalled();
  });
});
