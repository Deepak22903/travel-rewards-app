/**
 * Error Logger Tests
 * Unit tests for centralized error logging utility
 */

import { logError, logAPIError, logStorageError, logUIError } from '../errorLogger';

// Mock console methods
const mockConsoleGroup = jest.spyOn(console, 'group').mockImplementation();
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleGroupEnd = jest.spyOn(console, 'groupEnd').mockImplementation();

describe('errorLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logError', () => {
    it('should log error with message and stack', () => {
      const error = new Error('Test error');
      const context = { action: 'test' };

      logError(error, context);

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'Test error');
      expect(mockConsoleLog).toHaveBeenCalledWith('Stack:', error.stack);
      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', context);
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      const error = { message: 'Custom error' };
      
      logError(error);

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleError).toHaveBeenCalledWith(error);
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      
      logError(error);

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'String error message');
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should work without context', () => {
      const error = new Error('No context');
      
      logError(error);

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'No context');
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });
  });

  describe('logAPIError', () => {
    it('should log API errors with endpoint and method', () => {
      const error = new Error('Network error');
      
      logAPIError(error, '/rewards', 'GET');

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'Network error');
      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'API_ERROR',
        endpoint: '/rewards',
        method: 'GET',
      });
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should handle API errors without method', () => {
      const error = new Error('API failure');
      
      logAPIError(error, '/settings');

      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'API_ERROR',
        endpoint: '/settings',
        method: undefined,
      });
    });
  });

  describe('logStorageError', () => {
    it('should log storage read errors', () => {
      const error = new Error('Read failed');
      
      logStorageError(error, 'read', 'user_settings');

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'Read failed');
      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'STORAGE_ERROR',
        operation: 'read',
        key: 'user_settings',
      });
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should log storage write errors', () => {
      const error = new Error('Write failed');
      
      logStorageError(error, 'write', 'claimed_rewards');

      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'STORAGE_ERROR',
        operation: 'write',
        key: 'claimed_rewards',
      });
    });
  });

  describe('logUIError', () => {
    it('should log UI component errors', () => {
      const error = new Error('Render failed');
      
      logUIError(error, 'RewardsScreen', 'render');

      expect(mockConsoleGroup).toHaveBeenCalledWith('🚨 Error Logged');
      expect(mockConsoleLog).toHaveBeenCalledWith('Message:', 'Render failed');
      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'UI_ERROR',
        component: 'RewardsScreen',
        action: 'render',
      });
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should work without action', () => {
      const error = new Error('Component crashed');
      
      logUIError(error, 'Modal');

      expect(mockConsoleLog).toHaveBeenCalledWith('Context:', {
        type: 'UI_ERROR',
        component: 'Modal',
        action: undefined,
      });
    });
  });

  describe('integration', () => {
    it('should handle multiple errors in sequence', () => {
      const apiError = new Error('API failed');
      const storageError = new Error('Storage failed');
      const uiError = new Error('UI failed');

      logAPIError(apiError, '/rewards', 'GET');
      logStorageError(storageError, 'read', 'settings');
      logUIError(uiError, 'HomeScreen', 'mount');

      expect(mockConsoleGroup).toHaveBeenCalledTimes(3);
      expect(mockConsoleGroupEnd).toHaveBeenCalledTimes(3);
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });
});
