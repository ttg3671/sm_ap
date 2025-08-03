import { axiosPrivate } from '../api/axios';

import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();

	const userFromRedux = useSelector((state) => state.user.currentUser);

	// console.log(userFromRedux);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `MXDSAW ${userFromRedux?.token}`;
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
	}, [userFromRedux, refresh]);

	// console.log('Redux token:', userFromRedux?.token);

	return axiosPrivate;
}

export default useAxiosPrivate;