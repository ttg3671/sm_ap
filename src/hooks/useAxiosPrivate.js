import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from './useRefreshToken';
import { isTokenValid } from '../utils/tokenUtils';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();

	const userFromRedux = useSelector((state) => state.user.currentUser);

	console.log(userFromRedux);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization'] && userFromRedux?.token) {
					// Check if token is valid before using it
					if (isTokenValid(userFromRedux.token)) {
						config.headers['Authorization'] = `Bearer ${userFromRedux.token}`;
					} else {
						console.warn('Invalid token detected, attempting refresh...');
						// Token is invalid, trigger refresh
						refresh().then(newToken => {
							if (newToken) {
								config.headers['Authorization'] = `Bearer ${newToken}`;
							}
						});
					}
				}
				return config;
			}, (error) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			response => response,
			async (error) => {
				const prevRequest = error?.config;

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();

					if (newAccessToken) {
						prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
						return axiosPrivate(prevRequest);
					} else {
						// If refresh token fails, redirect to login
						window.location.href = '/';
						return Promise.reject(error);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		}
	}, [userFromRedux, refresh]);

	// console.log('Redux token:', userFromRedux?.token);

	return axiosPrivate;
}

export default useAxiosPrivate;