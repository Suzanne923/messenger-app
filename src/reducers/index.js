import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import chatReducer from './chat-reducer';
import authReducer from './auth-reducer';

const rootReducer = combineReducers({
  form,
  chat: chatReducer,
  auth: authReducer
});

export default rootReducer;
