import { SET_RESET_TOKEN } from './user.types';

const INITIAL_STATE = {
	currentUser: null,
	resetToken: null
}

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_CURRENT_USER':
			return {
				...state,
				currentUser: action.payload
			};

		case 'USER_LOGOUT':
			return {
				...state,
				currentUser: null,
				resetToken: null
			};

		case SET_RESET_TOKEN:
			return {
				...state,
				resetToken: action.payload,
			};

		default:
			return state;
	}
};

export default userReducer;