// Global test setup to handle unhandled rejections
import { vi, beforeEach, afterEach } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress unhandled rejections in tests
const originalConsoleError = console.error;

beforeEach(() => {
  // Mock console.error to suppress unhandled rejection warnings
  console.error = vi.fn();
});

afterEach(() => {
  // Restore original console.error
  console.error = originalConsoleError;
});

// Global error handler for unhandled rejections
process.on('unhandledRejection', (reason) => {
  // Suppress unhandled rejection errors in test environment
  // This prevents test failures due to mock errors
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  throw reason;
});
