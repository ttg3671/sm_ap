// Mock authentication service for development
const MOCK_USERS = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    token: 'mock-jwt-token-admin-12345',
    role: 'admin'
  }
];

export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      isSuccess: true,
      message: 'Login successful',
      token: user.token,
      user: {
        email: user.email,
        role: user.role
      }
    };
  } else {
    throw new Error('Invalid email or password. Please try again...');
  }
};

export const mockRefreshToken = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    isSuccess: true,
    token: 'mock-jwt-token-refreshed-12345'
  };
}; 