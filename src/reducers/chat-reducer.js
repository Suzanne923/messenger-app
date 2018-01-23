import {
  ADD_CHAT,
  SET_ACTIVE_CHAT,
  FETCH_USERS
} from '../actions/types';

const initialState = { messages: [{author: 'Suzanne', message: 'Hey, how are you doing?', time: '21/01/2018, 16:07'}] };

export default function(state = initialState, action) {
  switch(action.type) {
    /*case NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };*/
    case FETCH_USERS:
      return { ...state, users: action.users };
    case ADD_CHAT:
      return { ...state, chats: [...state.chats, action.chat] };
    case SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    default:
      return state;
  }
}
