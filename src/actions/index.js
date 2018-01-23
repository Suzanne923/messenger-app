import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  ADD_CHAT,
  SET_ACTIVE_CHAT,
  FETCH_USERS
} from './types';

// const ROOT_URL = 'http://localhost:3000';

/*export function newMessage(message) {
  return {
    type: NEW_MESSAGE,
    payload: message
  };
} */

export function loginUser(name) {
  return {
    type: AUTH_USER,
    payload: name
  };
}

export function logoutUser() {
  return {
    type: UNAUTH_USER
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

// adds a new chat conversation to the list of open chats
export function addChat(chat) {
  return {
    type: ADD_CHAT,
    payload: chat
  };
}

// sets the current chat conversation as active chat
export function setActiveChat(chat) {
  return {
    type: SET_ACTIVE_CHAT,
    payload: chat
  };
}

export function fetchUsers() {
  let users = [];
  // logic to fetch online users from db
  return {
    type: FETCH_USERS,
    payload: users
  };
}
// action for saving message in db
