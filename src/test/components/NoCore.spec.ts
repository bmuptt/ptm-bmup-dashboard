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

  test('should handle core setting with custom primary color', async () => {
    // Mock core setting response with custom primary color
    const customResponse = {
      data: {
        success: true,
        data: {
          id: 1,
          name: 'PTM BMUP',
          logo: 'http://localhost:8000/storage/logos/test.jpg',
          description: 'Test description',
          address: 'Test address',
          maps: null,
          primary_color: '#f86f24',
          secondary_color: '#efbc37',
          created_at: '2025-08-27T15:08:11.000000Z',
          updated_at: '2025-09-05T21:32:25.000000Z'
        }
      }
    };

    vi.mocked(getCoreSetting).mockResolvedValue(customResponse as AxiosResponse);
    
    const result = await getCoreSetting();
    
    expect(getCoreSetting).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.primary_color).toBe('#f86f24');
    expect(result.data.data.name).toBe('PTM BMUP');
  });

  test('should handle core setting with empty primary color', async () => {
    // Mock core setting response without primary color
    const responseWithoutColor = {
      data: {
        success: true,
        data: {
          id: 1,
          name: 'PTM BMUP',
          logo: 'http://localhost:8000/storage/logos/test.jpg',
          description: 'Test description',
          address: 'Test address',
          maps: null,
          primary_color: '',
          secondary_color: '#efbc37',
          created_at: '2025-08-27T15:08:11.000000Z',
          updated_at: '2025-09-05T21:32:25.000000Z'
        }
      }
    };

    vi.mocked(getCoreSetting).mockResolvedValue(responseWithoutColor as AxiosResponse);
    
    const result = await getCoreSetting();
    
    expect(getCoreSetting).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
    expect(result.data.data.primary_color).toBe('');
  });
});
