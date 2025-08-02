
import { devUtils, DEV_CONFIG } from '../config/devConfig';

export class ApiService {
  constructor(axiosInstance) {
    this.axios = axiosInstance;
    // Don't setup interceptors to avoid conflicts with useAxiosPrivate
    // this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for professional logging
    this.axios.interceptors.request.use(
      (config) => {
        devUtils.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data
        });
        
        // Add request timestamp for performance monitoring
        config.metadata = { startTime: new Date() };
        return config;
      },
      (error) => {
        devUtils.error('Request Setup Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for professional error handling
    this.axios.interceptors.response.use(
      (response) => {
        const duration = new Date() - response.config.metadata.startTime;
        devUtils.log('API Response:', {
          status: response.status,
          url: response.config.url,
          duration: `${duration}ms`
        });
        return response;
      },
      (error) => {
        const duration = error.config?.metadata ? 
          new Date() - error.config.metadata.startTime : 'unknown';
        
        devUtils.error('API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          duration: `${duration}ms`,
          message: error.message
        });
        
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Professional error handling following industry standards
   */
  handleApiError(error) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      userAgent: navigator.userAgent,
      // In production, add user ID, session ID, etc.
    };

    // Log error for monitoring (would integrate with Sentry, LogRocket, etc. in production)
    devUtils.error('Detailed API Error:', errorInfo);

    // Return standardized error format
    return {
      ...error,
      standardizedError: {
        type: this.categorizeError(error.response?.status),
        userMessage: this.getUserFriendlyMessage(error),
        technicalDetails: errorInfo,
        retryable: this.isRetryableError(error.response?.status)
      }
    };
  }

  categorizeError(status) {
    if (!status) return 'NETWORK_ERROR';
    if (status >= 500) return 'SERVER_ERROR';
    if (status === 404) return 'NOT_FOUND';
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 403) return 'FORBIDDEN';
    if (status === 400) return 'VALIDATION_ERROR';
    return 'CLIENT_ERROR';
  }

  getUserFriendlyMessage(error) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (!status) return 'Network connection issue. Please check your internet connection.';
    
    switch (status) {
      case 400:
        if (serverMessage?.includes('already found') || serverMessage?.includes('duplicate')) {
          return 'This item already exists in your selection.';
        }
        if (serverMessage?.includes('Value already found')) {
          return 'This content is already added to the home page.';
        }
        return 'Invalid input. Please check your data and try again.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified.';
      default:
        return serverMessage || 'An unexpected error occurred. Please try again.';
    }
  }

  isRetryableError(status) {
    // Network errors and 5xx errors are retryable
    return !status || status >= 500 || status === 429;
  }

  /**
   * Professional API call with retry logic and proper error handling
   */
  async makeRequest(requestConfig) {
    // Ensure method is explicitly set and not modified during retries
    const config = {
      ...requestConfig,
      method: requestConfig.method?.toUpperCase() || 'GET'
    };
    
    // Check if this is a retryable request
    const makeApiCall = async () => {
      try {
        devUtils.log('Making API request:', config.method, config.url, config.params);
        const startTime = new Date();
        
        const response = await this.axios(config);
        
        const duration = new Date() - startTime;
        devUtils.log('API Response:', {
          status: response.status,
          url: config.url,
          duration: `${duration}ms`
        });
        
        // Validate response structure (professional practice)
        if (DEV_CONFIG.VALIDATE_DATA_INTEGRITY) {
          this.validateResponse(response);
        }
        
        return response;
      } catch (error) {
        devUtils.error('API request failed:', {
          method: config.method,
          url: config.url,
          status: error.response?.status,
          message: error.message
        });
        
        // Add professional error handling and re-throw
        throw this.handleApiError(error);
      }
    };
    
    // Check if this is a client error that should not be retried
    try {
      return await makeApiCall();
    } catch (error) {
      const status = error.response?.status || error.standardizedError?.technicalDetails?.status;
      
      // Don't retry client errors (400, 401, 403, 404)
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        throw error;
      }
      
      // For server errors and network issues, apply retry logic
      return devUtils.retryApiCall(makeApiCall);
    }
  }

  validateResponse(response) {
    if (!response.data) {
      throw new Error('Invalid response: missing data');
    }
    
    // Add more validation as needed
    devUtils.log('Response validation passed');
  }

  // Professional CRUD operations
  async create(endpoint, data) {
    return this.makeRequest({
      method: 'POST',
      url: endpoint,
      data,
      timeout: DEV_CONFIG.REQUEST_TIMEOUT
    });
  }

  async read(endpoint, params = {}) {
    return this.makeRequest({
      method: 'GET',
      url: endpoint,
      params,
      timeout: DEV_CONFIG.REQUEST_TIMEOUT
    });
  }

  async update(endpoint, data) {
    return this.makeRequest({
      method: 'PUT',
      url: endpoint,
      data,
      timeout: DEV_CONFIG.REQUEST_TIMEOUT
    });
  }

  async patch(endpoint, data) {
    return this.makeRequest({
      method: 'PATCH',
      url: endpoint,
      data,
      timeout: DEV_CONFIG.REQUEST_TIMEOUT
    });
  }

  async delete(endpoint) {
    return this.makeRequest({
      method: 'DELETE',
      url: endpoint,
      timeout: DEV_CONFIG.REQUEST_TIMEOUT
    });
  }
}

export default ApiService;
