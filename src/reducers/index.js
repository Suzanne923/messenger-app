import { combineReducers } from 'redux';
import chatReducer from './chat-reducer';
import authReducer from './auth-reducer';
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
  form,
  chat: chatReducer,
  auth: authReducer
});

export default rootReducer;
