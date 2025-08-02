// Configuration with API fallback for CORS issues
export const DEV_CONFIG = {
  // Try real API first, fallback to demo data if CORS blocks
  USE_MOCK_DATA: false, // We'll handle fallback in the code
  API_BASE: '/api/v1',
  // Add fallback settings
  ENABLE_API_FALLBACK: true, // Fallback to demo data on CORS/network errors
  REQUEST_TIMEOUT: 10000,
  // Add the missing fields that Index.jsx is checking for
  TRACK_USER_ACTIONS: true,
  ENFORCE_BUSINESS_RULES: false, // Disable strict business rules for now
  VALIDATE_DATA_INTEGRITY: false // Disable strict validation for now
};

export const devUtils = {
  log: (...args) => {
    console.log(...args);
  },
  
  error: (...args) => {
    console.error(...args);
  },
  
  // Add the missing retryApiCall function
  retryApiCall: async (apiCall, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
};
