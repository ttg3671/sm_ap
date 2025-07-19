import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, logoutUser } from '../redux/user/user.actions';
import { persistor } from '../redux/store';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const refresh = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/refresh', {
        withCredentials: true
      });

      console.log('Refresh response:', response.data);

      if (response.data && response.data.isSuccess) {
        dispatch(
          setCurrentUser({
            ...currentUser,
            token: response.data.token,
          })
        );

        return response.data.token;
      } else {
        throw new Error("Refresh failed - invalid response");
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, logout the user
      dispatch(logoutUser());
      persistor.purge();
      
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;