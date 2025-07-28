import axiosInstance, {axiosPrivate} from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.actions';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const refresh = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/refresh/admin', {
        withCredentials: true
      });

      // console.log(response.data);

      if (response.data && response.data.isSuccess) {
	      dispatch(
	        setCurrentUser({
	          ...currentUser,
	          token: response.data.token,
	        })
	      );

	      return response.data.token;
	  	}

	  	else {
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