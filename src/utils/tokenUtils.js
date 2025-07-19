// Utility functions for JWT token management

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic token format validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired (if it has an exp claim)
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    console.error('Error parsing token expiration:', error);
    return null;
  }
};

export const isTokenExpiringSoon = (token, thresholdMinutes = 5) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  
  const now = new Date();
  const threshold = new Date(now.getTime() + thresholdMinutes * 60 * 1000);
  
  return expiration <= threshold;
}; 