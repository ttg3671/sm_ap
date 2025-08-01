import axios from 'axios';

// We'll use the proxy/rewrite setup for both development and production
const isDev = import.meta.env.DEV;

// Use relative paths for both dev and production to leverage Vite proxy and Vercel rewrites
const BASE_URL = '/api/v1';
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
	BASE_URL: '/api/v1',
	IMG_URL,
	SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://api.yenumax.com',
	BASE_PATH: import.meta.env.VITE_BASE_PATH || '/'
};