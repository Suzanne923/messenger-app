import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  ADD_USER,
  REMOVE_USER,
  ADD_CHAT,
  REMOVE_CHAT,
  RESET_CHAT,
  SET_ACTIVE_CHAT,
  ADD_MESSAGE_TO_CHAT,
  UPDATE_TYPING_IN_CHAT,
  ADD_USER_TO_CHAT,
  REMOVE_USER_FROM_CHAT
} from './types';

const ROOT_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3230' : `${window.location.protocol}//${window.location.hostname}`;

export function loginUser({ username, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/login`, { username, password })
      .then(response => {
        dispatch({
          type: AUTH_USER,
          payload: username
        });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/');
      })
      .catch(() => {
        dispatch(authError('Bad Login Info'));
      })
  };
}

export function registerUser({ username, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/register`, { username, password })
      .then(response => {
        dispatch({
          type: AUTH_USER,
          payload: username
        });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/');
      })
      .catch(response => {
        console.log(response);
        dispatch(authError(response.response.data.error));
      })
  };
}

export function reconnectUser(username, callback) {
  callback();
  return {
    type: AUTH_USER,
    payload: username
  };
}

export function logoutUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function fetchUser(token) {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/authenticate`, {
      headers: { authorization: token }
    })
    .then(response => {
        dispatch({
          type: AUTH_USER,
          payload: response.data.username
        })
        browserHistory.push('/');
    });
  }
}

export function fetchUsers(users) {
  return {
    type: ADD_USER,
    users
  };
}

export function removeUser(users) {
  return {
    type: REMOVE_USER,
    users
  };
}

// adds a new chat conversation to the list of open chats
export function addChat(chat) {
  return {
    type: ADD_CHAT,
    payload: chat
  };
}

export function removeChat(chat) {
  return {
    type: REMOVE_CHAT,
    payload: chat.id
  };
}

export function resetChat() {
  let cleanChatArray = [];
  return {
    type: RESET_CHAT,
    payload: cleanChatArray
  };
}

// sets the current chat conversation as active chat
export function setActiveChat(chat) {
  return {
    type: SET_ACTIVE_CHAT,
    payload: chat
  };
}

export function addMessageToChat(chatId, message) {
  return {
    type: ADD_MESSAGE_TO_CHAT,
    id: chatId,
    message: message.message
  };
}

export function updateTypingInChat(isTyping, chatId, user) {
  return {
    type: UPDATE_TYPING_IN_CHAT,
    isTyping,
    id: chatId,
    user
  };
}


export function addUserToChat(chatId, user) {
  return {
    type: ADD_USER_TO_CHAT,
    id: chatId,
    user
  };
}

export function removeUserFromChat(user) {
  return {
    type: REMOVE_USER_FROM_CHAT,
    user
  }
}
