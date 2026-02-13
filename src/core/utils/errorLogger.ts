/**
 * Error Logger Utility
 * Centralized error logging for development and production
 */

interface ErrorContext {
  [key: string]: any;
}

/**
 * Log errors with context information
 * In development: console.error
 * In production: could integrate with Sentry, Crashlytics, etc.
 */
export const logError = (
  error: Error | unknown,
  context?: ErrorContext
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (__DEV__) {
    // Development: Console logging
    console.group('🚨 Error Logged');
    console.error('Message:', errorMessage);
    if (errorStack) {
      console.error('Stack:', errorStack);
    }
    if (context) {
      console.log('Context:', context);
    }
    console.groupEnd();
  } else {
    // Production: Send to error tracking service
    // TODO: Integrate with Sentry or Firebase Crashlytics
    // Example:
    // Sentry.captureException(error, { extra: context });
    
    // For now, just log to console in production too
    console.error('Error:', errorMessage, context);
  }
};

/**
 * Log API errors with request details
 */
export const logAPIError = (
  error: Error | unknown,
  endpoint: string,
  method: string = 'GET'
): void => {
  logError(error, {
    type: 'API_ERROR',
    endpoint,
    method,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log storage errors (AsyncStorage)
 */
export const logStorageError = (
  error: Error | unknown,
  operation: 'read' | 'write' | 'delete',
  key: string
): void => {
  logError(error, {
    type: 'STORAGE_ERROR',
    operation,
    key,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log UI errors (component crashes, rendering issues)
 */
export const logUIError = (
  error: Error | unknown,
  componentName: string,
  action?: string
): void => {
  logError(error, {
    type: 'UI_ERROR',
    component: componentName,
    action,
    timestamp: new Date().toISOString(),
  });
};
