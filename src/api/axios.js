import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

console.log('API Base URL:', BASE_URL);

export default axios.create({
	baseURL: BASE_URL,
	timeout: 10000, // 10 second timeout
	headers: {
		'Content-Type': 'application/json',
	}
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	timeout: 10000, // 10 second timeout
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true
})