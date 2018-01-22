import {
  AUTH_USER,
  UNAUTH_USER
} from './types';

// const ROOT_URL = 'http://localhost:3000';

/*export function newMessage(message) {
  return {
    type: NEW_MESSAGE,
    payload: message
  };
} */

export function loginUser({ username, password }) {
  return {
    type: AUTH_USER,
    payload: username
  };
}

export function logoutUser() {
  return {
    type: UNAUTH_USER
  };
}

// action for saving message in db
