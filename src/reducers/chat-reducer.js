import {

} from '../actions/types';

const initialState = { messages: [{author: 'Suzanne', message: 'Hey, how are you doing?', time: '21/01/2018, 16:07'}] };

export default function(state = initialState, action) {
  switch(action.type) {
    /*case NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };*/
    default:
      return state;
  }
}
