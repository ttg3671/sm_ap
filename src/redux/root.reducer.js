import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import positionReducer from './position/position.reducer';
import authReducer from '../store/authSlice';
import themeReducer from '../store/themeSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'position', 'auth']  // Add auth to persist login state
};

const rootReducer = combineReducers({
  user: userReducer,
  position: positionReducer,
  auth: authReducer,
  theme: themeReducer
});

export default persistReducer(persistConfig, rootReducer);
