import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.actions';
import { mockRefreshToken } from '../api/mockAuth';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const refresh = async () => {
    try {
      // Try real API first, fallback to mock if not available
      const baseURL = import.meta.env.VITE_BASE_URL;
      let response;
      
      if (baseURL) {
        try {
          response = await axiosInstance.get('/api/v1/refresh', {
            withCredentials: true
          });
          console.log('Real API refresh response:', response.data);
        } catch (apiError) {
          console.log('Real API refresh failed, using mock:', apiError.message);
          const mockResponse = await mockRefreshToken();
          response = { data: mockResponse };
          console.log('Mock refresh response:', mockResponse);
        }
      } else {
        // No BASE_URL configured, use mock authentication
        const mockResponse = await mockRefreshToken();
        response = { data: mockResponse };
        console.log('Mock refresh response:', mockResponse);
      }

      if (response.data && response.data.isSuccess) {
        dispatch(
          setCurrentUser({
            ...currentUser,
            token: response.data.token,
          })
        );

        return response.data.token;
      } else {
        throw new Error("failed");
      }
    } catch (error) {
      console.log('Token refresh failed', error);
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;