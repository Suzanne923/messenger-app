import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR
} from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, error: '', username: action.payload, authenticated: true };
    case UNAUTH_USER:
      return { ...state, username: '', authenticated: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
