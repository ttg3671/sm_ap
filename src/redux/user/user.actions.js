import { SET_RESET_TOKEN } from './user.types';

export const setCurrentUser = user => ({
	type: 'SET_CURRENT_USER',
	payload: user
});

export const logoutUser = () => ({
  type: 'USER_LOGOUT'
});

export const setResetToken = (token) => ({
  type: SET_RESET_TOKEN,
  payload: token,
});