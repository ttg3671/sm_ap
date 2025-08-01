import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	
	// Get user token from Redux store with fallback to session storage
	const auth = useSelector((state) => state?.auth || {});
	const userToken = auth?.token || sessionStorage.getItem('authToken');
	
	// For debugging - useful to see if token is being correctly retrieved
	// console.log('Token from Redux/sessionStorage:', userToken);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					// Use Bearer token format which is more standard
					config.headers['Authorization'] = `Bearer ${userToken}`;
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

					// console.log(newAccessToken);
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}

				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		}
	}, [userToken, refresh]);

	// console.log('Using token:', userToken);

	return axiosPrivate;
}

export default useAxiosPrivate;