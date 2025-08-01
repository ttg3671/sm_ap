// Environment configuration for API endpoints
const config = {
  development: {
    API_URL: 'http://localhost:3001/api',
    UPLOAD_URL: 'http://localhost:3001/uploads'
  },
  production: {
    API_URL: '/api', // Use Vercel proxy first
    UPLOAD_URL: '/api/uploads',
    FALLBACK_API_URL: 'https://api.yenumax.com/api' // Direct API as fallback
  }
};

const environment = process.env.NODE_ENV || 'development';

export const API_CONFIG = {
  BASE_URL: config[environment].API_URL,
  UPLOAD_URL: config[environment].UPLOAD_URL,
  FALLBACK_URL: config[environment].FALLBACK_API_URL,
  SOCKET_URL: 'https://api.yenumax.com/',
  BASE_PATH: '/',
  MAX_FILE_SIZE: 5242880, // 5MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Utility function to get auth headers
export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Enhanced utility function for API calls with CORS handling
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include',
    ...options
  };

  // If it's FormData, don't set Content-Type (let browser set it)
  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  }

  try {
    // First try with the proxy URL
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.warn('Primary API call failed, trying fallback...', error);
    
    // If proxy fails and we have a fallback URL, try direct API with no-cors mode
    if (API_CONFIG.FALLBACK_URL && url.includes('/api/')) {
      const fallbackUrl = url.replace('/api/', `${API_CONFIG.FALLBACK_URL}/`);
      try {
        const fallbackResponse = await fetch(fallbackUrl, {
          ...defaultOptions,
          mode: 'no-cors', // This bypasses CORS but limits response access
        });
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Fallback API call also failed:', fallbackError);
        throw error; // Throw original error
      }
    }
    
    throw error;
  }
};

export default API_CONFIG;