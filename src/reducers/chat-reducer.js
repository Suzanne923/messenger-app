import {
  ADD_USER,
  ADD_CHAT,
  RESET_CHAT,
  SET_ACTIVE_CHAT,
  ADD_MESSAGE_TO_CHAT,
  UPDATE_TYPING_IN_CHAT,
  ADD_USER_TO_CHAT
} from '../actions/types';

let newActiveChat;
let newChats;
let newChat;

export default function(state = {}, action) {
  switch(action.type) {
    case ADD_USER:
      return { ...state, users: action.users };
    case ADD_CHAT:
      return { ...state, chats: [ ...state.chats, action.payload ] };
    case RESET_CHAT:
    return { ...state, chats: action.payload };
    case SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    case ADD_MESSAGE_TO_CHAT:
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          newChat =  { ...chat, messages: [...chat.messages, action.message] }
          newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
          return newChat;
        }
        return chat;
      })
      return {...state, chats: newChats, activeChat: newActiveChat };
    case UPDATE_TYPING_IN_CHAT:
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          if (action.isTyping && !chat.typingUsers.includes(action.user)) {
            newChat =  { ...chat, typingUsers: [...chat.typingUsers, action.user] }
            newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
            return newChat;
          } else if (!action.isTyping && chat.typingUsers.includes(action.user)) {
            newChat = { ...chat, typingUsers: chat.typingUsers.filter(u => u !== action.user) }
            newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
            return newChat;
          }
        }
        return chat;
      })
      return { ...state, chats: newChats, activeChat: newActiveChat };
    case ADD_USER_TO_CHAT:
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          newChat = { ...chat, users: [...chat.users, action.user] };
          newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
          return newChat;
        }
        return chat;
      })
      return { ...state, chats: newChats, activeChat: newActiveChat };
    default:
      return state;
  }
}
