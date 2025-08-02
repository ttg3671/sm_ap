// Production-ready configuration for market standards
export const DEV_CONFIG = {
  // ALWAYS use real API for professional development
  USE_MOCK_DATA: false, // Changed to false for professional standards
  
  // API endpoints
  API_BASE: '/api/v1',
  REQUEST_TIMEOUT: 10000, // 10 seconds timeout (industry standard)
  RETRY_ATTEMPTS: 3, // Retry failed requests (professional approach)
  
  // Professional debugging (only in development)
  ENABLE_CONSOLE_LOGS: true,
  ENABLE_ERROR_DETAILS: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Production error handling
  SHOW_USER_FRIENDLY_ERRORS: true,
  LOG_ERRORS_TO_SERVICE: false, // Would be true in real production
  
  // Professional standards
  VALIDATE_DATA_INTEGRITY: true,
  ENFORCE_BUSINESS_RULES: true,
  TRACK_USER_ACTIONS: true
};

// Professional utility functions
export const devUtils = {
  log: (...args) => {
    if (DEV_CONFIG.ENABLE_CONSOLE_LOGS && import.meta.env.DEV) {
      console.log('[APP]', new Date().toISOString(), ...args);
    }
  },
  
  error: (...args) => {
    console.error('[ERROR]', new Date().toISOString(), ...args);
    // In production, this would send to error tracking service
    if (DEV_CONFIG.LOG_ERRORS_TO_SERVICE) {
      // sendToErrorTrackingService(...args);
    }
  },
  
  warn: (...args) => {
    if (DEV_CONFIG.ENABLE_CONSOLE_LOGS) {
      console.warn('[WARNING]', new Date().toISOString(), ...args);
    }
  },
  
  performance: (label, fn) => {
    if (!DEV_CONFIG.ENABLE_PERFORMANCE_MONITORING) return fn();
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`[PERFORMANCE] ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  },
  
  // Professional API retry logic
  retryApiCall: async (apiCall, maxRetries = DEV_CONFIG.RETRY_ATTEMPTS) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        devUtils.log(`API attempt ${attempt}/${maxRetries}`);
        return await apiCall();
      } catch (error) {
        devUtils.warn(`API attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        // Don't retry certain types of errors
        if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
          devUtils.error('Professional error handling activated:', error);
          throw error;
        }
        
        if (attempt === maxRetries) {
          devUtils.error('All retry attempts exhausted:', error);
          throw error;
        }
        
        // Exponential backoff (industry standard)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        devUtils.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};
