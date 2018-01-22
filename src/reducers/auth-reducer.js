import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR
  // FETCH_MESSAGE
} from '../actions/types';

const initialState = { messages: [{author: 'Suzanne', message: 'Hey, how are you doing?', time: '21/01/2018, 16:07'}] };

export default function(state = initialState, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, username: action.payload, authenticated: true };
    case UNAUTH_USER:
      return { ...state, username: '', authenticated: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    /*case FETCH_MESSAGE:
      return { ...state, message: action.payload };*/
    default:
      return state;
  }
}
