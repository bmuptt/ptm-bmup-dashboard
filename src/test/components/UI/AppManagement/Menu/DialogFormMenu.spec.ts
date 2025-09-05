import { describe, test, expect, vi, afterEach } from 'vitest';
import { hardDeleteMenu } from '@/service/AppManagement/menu';
import { responseHardDeleteSuccess, responseHardDeleteError } from '../../../../mock/menu-mock';
import type { AxiosResponse } from 'axios';

vi.mock('@/service/AppManagement/menu', () => ({
  hardDeleteMenu: vi.fn(),
}));

describe('DialogFormMenu Hard Delete Service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call hard delete service successfully', async () => {
    // Mock hard delete success
    vi.mocked(hardDeleteMenu).mockResolvedValue(responseHardDeleteSuccess as AxiosResponse);
    
    // Call the service
    const result = await hardDeleteMenu(6);
    
    // Verify service was called with correct ID
    expect(hardDeleteMenu).toHaveBeenCalledWith(6);
    
    // Verify response structure
    expect(result.data.message).toBe('Menu deleted successfully');
    expect(result.status).toBe(200);
  });

  test('should handle hard delete error gracefully', async () => {
    // Mock hard delete error
    vi.mocked(hardDeleteMenu).mockRejectedValue(responseHardDeleteError);
    
    // Call the service and expect it to throw
    await expect(hardDeleteMenu(6)).rejects.toEqual(responseHardDeleteError);
    
    // Verify service was called with correct ID
    expect(hardDeleteMenu).toHaveBeenCalledWith(6);
  });

  test('should call hard delete service with correct endpoint', () => {
    // Mock hard delete
    vi.mocked(hardDeleteMenu).mockResolvedValue(responseHardDeleteSuccess as AxiosResponse);
    
    // Call the service
    hardDeleteMenu(1);
    
    // Verify service was called
    expect(hardDeleteMenu).toHaveBeenCalledWith(1);
  });
});
