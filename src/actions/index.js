import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_USER,
  ADD_USER,
  ADD_CHAT,
  RESET_CHAT,
  SET_ACTIVE_CHAT,
  ADD_MESSAGE_TO_CHAT,
  UPDATE_TYPING_IN_CHAT
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
        browserHistory.push('/chatbox');
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
        browserHistory.push('/chatbox');
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

export function logoutUser(callback) {
  localStorage.removeItem('token');
  callback();
  return { type: UNAUTH_USER };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function fetchUser(token) {
  console.log('fetching user...');
  return function(dispatch) {
    axios.get(`${ROOT_URL}/chatbox` {
      headers: { authorization: localStorage.getItem('token') }
    })
    .then(response => {
      console.log('request: ', request, ' response: ', response);
        dispatch({
          type: FETCH_USER,
          // payload: response.data.message
        })
    });
}

export function fetchUsers(users) {
  return {
    type: ADD_USER,
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
// chat = {id: uuidv4, name, messages: [], users: [], typingUsers: [] }

export function resetChat() {
  let cleanChatArray = [];
  return {
    type: RESET_CHAT,
    payload: cleanChatArray
  };
}
// state.chats: [id: { name: chat.name, messages: chat.messages }]

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

export function updateTypingInChat(isTyping, id, user) {
  return {
    type: UPDATE_TYPING_IN_CHAT,
    isTyping,
    id,
    user
  };
}
// [ ...state.chat, { ChatId: {name: ChatName, messages: [ ...messages, addedmessage ]}}]]
