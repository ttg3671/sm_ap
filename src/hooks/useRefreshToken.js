import axiosInstance, {axiosPrivate} from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.actions';
import { loginSuccess } from '../store/authSlice';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  
  // Access auth from redux store
  const auth = useSelector((state) => state?.auth || {});
  const user = auth?.user;
  
  const refresh = async () => {
    try {
      // Get the current token from session storage as a fallback
      const currentToken = sessionStorage.getItem('authToken');
      
      // Try to refresh the token using axiosInstance which already has the correct baseURL
      const response = await axiosInstance.get(`/auth/refresh/admin`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (response.data && response.data.isSuccess) {
          // Update the token in Redux store
          if (user) {
              dispatch(loginSuccess({
                  user,
                  token: response.data.token
              }));
          }
          
          // Always update session storage
          sessionStorage.setItem('authToken', response.data.token);
          
          console.log('Token refreshed successfully');
          return response.data.token;
      } else {
          // In development, generate a fake token if refresh fails
          if (process.env.NODE_ENV !== 'production') {
              console.warn('Using generated token for development');
              const demoToken = btoa(`refresh:${new Date().getTime()}`);
              
              if (user) {
                  dispatch(loginSuccess({
                      user,
                      token: demoToken
                  }));
              }
              
              sessionStorage.setItem('authToken', demoToken);
              return demoToken;
          }
          
	  	  throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.log('Token refresh failed', error);
      
      // Return the existing token if refresh fails
      // This helps prevent immediate logout on temporary API issues
      return sessionStorage.getItem('authToken');
    }
  };

  return refresh;
};

export default useRefreshToken;