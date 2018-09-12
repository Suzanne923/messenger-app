import {
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
} from '../actions/types';

let newActiveChat;
let newChats;
let newChat;
let newUsers;

export default function (state = { users: [] }, action) {
  switch (action.type) {
    case ADD_USER: {
      const isNewUser = state.users.map(u => u.name).includes(action.user.name);
      return isNewUser ? state : { ...state, users: [...state.users, action.user] };
    }
    case REMOVE_USER:
      return { ...state, users: state.users.filter(user => user.name !== action.payload) };
    case ADD_CHAT:
      return { ...state, chats: [...state.chats, action.payload] };
    case REMOVE_CHAT: {
      newChats = state.chats.filter(chat => (chat.id !== action.payload));
      newActiveChat = newChats.length ? newChats[0] : undefined;

      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat
      };
    }
    case RESET_CHAT:
      return { ...state, chats: action.payload };
    case SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    case ADD_MESSAGE_TO_CHAT: {
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          newChat = { ...chat, messages: [...chat.messages, action.message] };
          newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
          return newChat;
        }
        return chat;
      });

      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat
      };
    }
    case UPDATE_TYPING_IN_CHAT: {
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          if (action.isTyping && !chat.typingUsers.map(u => u.name).includes(action.user.name)) {
            newChat = { ...chat, typingUsers: [...chat.typingUsers, action.user] };
            newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
            return newChat;
          }
          if (!action.isTyping && chat.typingUsers.map(u => u.name).includes(action.user.name)) {
            newChat = { ...chat, typingUsers: chat.typingUsers.filter(u => u.name !== action.user.name) };
            newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
            return newChat;
          }
        }
        return chat;
      });

      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat
      };
    }
    case ADD_USER_TO_CHAT: {
      newChats = state.chats.map((chat) => {
        if (chat.id === action.id) {
          newChat = { ...chat, users: [...chat.users, action.user] };
          newActiveChat = (state.activeChat.id === newChat.id) ? newChat : state.activeChat;
          return newChat;
        }
        return chat;
      });

      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat
      };
    }
    case REMOVE_USER_FROM_CHAT: {
      newChats = state.chats.filter((chat) => {
        newChat = chat;
        newUsers = chat.users.filter(user => (user.name !== action.user.name));
        newChat.users = newUsers;
        newActiveChat = (state.activeChat.id === chat.id) ? newChat : state.activeChat;
        return (newChat.name === "Community" || newChat.users.length > 1);
      });

      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat
      };
    }
    default:
      return state;
  }
}
