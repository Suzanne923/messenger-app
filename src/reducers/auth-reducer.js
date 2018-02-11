import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_USER
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, error: '', username: action.username, authenticated: true };
    case UNAUTH_USER:
      return { ...state, username: '', authenticated: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case FETCH_USER:
      return { ...state, error: '', username: action.username, base64: action.base64, authenticated: true };
    default:
      return state;
  }
}
