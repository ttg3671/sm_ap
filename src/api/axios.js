import axios from 'axios';

// Use proxy for development and direct API for production
const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? '/api/v1' : (import.meta.env.VITE_BASE_URL || 'https://api.yenumax.com');
const IMG_URL = import.meta.env.VITE_IMG_URL || 'https://yenumax.com/api/uploads/';

// Standard axios instance
export default axios.create({
	baseURL: BASE_URL
});

// Private axios instance with authentication
export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

// Export URLs for use in components
export const API_URLS = {
	BASE_URL,
	IMG_URL,
	SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://api.yenumax.com',
	BASE_PATH: import.meta.env.VITE_BASE_PATH || '/'
};