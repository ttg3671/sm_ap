import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import positionReducer from './position/position.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'position']  // Add 'position' if you want to persist it
};

const rootReducer = combineReducers({
  user: userReducer,
  position: positionReducer
});

export default persistReducer(persistConfig, rootReducer);
