import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { USER_CONNECTED, LOGOUT, MESSAGE_SENT, MESSAGE_RECEIVED, TYPING,
  COMMUNITY_CHAT, PRIVATE_MESSAGE, NEW_USER_ADDED, ADDED_TO_CHAT } from '../events';
import SideBar from './sidebar/sidebar';
import ChatHeading from './chat/chat-heading';
import Messages from './chat/messages';
import MessageInput from './chat/message-input';

import '../style/chatroom.css';

class ChatContainer extends Component {
  static defaultProps = {
    users: [],
    chats: [],
    activeChat: {}
  }

  componentWillMount() {
    const { socket } = this.props;
    this.initSocket(socket);
  }

  initSocket(socket) {
    socket.on(PRIVATE_MESSAGE, this.addChat);
    socket.on(ADDED_TO_CHAT, this.addChat);
    socket.on(NEW_USER_ADDED, this.props.addUserToChat);
    socket.on(USER_CONNECTED, this.fetchUsers);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat);
    });
  }

  fetchUsers = (connectedUsers) => {
    const { fetchUsers } = this.props;
    const users = Object.keys(connectedUsers);
    fetchUsers(users);
  }

  sendOpenPrivateMessage = (receiver) => {
    const { socket, user } = this.props;
    socket.emit(PRIVATE_MESSAGE, { receiver, sender: user });
  }

  addUserToChat = (receiver) => {
    const { socket, activeChat } = this.props;
    socket.emit(NEW_USER_ADDED, { receiver, activeChat });
  }

  logout = () => {
    const { socket, logoutUser } = this.props;
    socket.emit(LOGOUT);
    logoutUser();
  };

  resetChat = (chat) => {
    return this.addChat(chat, true);
  }

  addChat = (chat, reset = false) => {
    const { socket, resetChat, setActiveChat, addChat } = this.props;
    if (reset) {
      resetChat();
      setActiveChat(chat);
    }
    addChat(chat);

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;
    socket.on(messageEvent, this.addMessageToChat(chat.id))
    socket.on(typingEvent, this.updateTypingInChat(chat.id));
  }

  addMessageToChat = (chatId) => {
    const { addMessageToChat } = this.props;
    return (message) => {
      addMessageToChat(chatId, message);
    }
  }

  updateTypingInChat = (chatId) => {
    const { updateTypingInChat } = this.props;
    return ({ isTyping, user }) => {
      if (user !== this.props.user) {
        updateTypingInChat(isTyping, chatId, user);
      }
    }
  }

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, {chatId, message});
  }

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, {chatId, isTyping});
  }

  render() {
    const { socket, user, users, chats, activeChat, setActiveChat } = this.props;
    return (
      <div className="container chat-container">
        <SideBar
          socket={socket}
          user={user}
          users={users}
          chats={chats}
          activeChat={activeChat}
          onSendPrivateMessage={this.sendOpenPrivateMessage}
          onSetActiveChat={setActiveChat}
        />
        <div className="chatbox">
          {activeChat.name ? (
            <div className="chat-room">
              <ChatHeading
                name={activeChat.name}
                onAddUserToChat={this.addUserToChat}
              />
              <Messages
                user={user}
                messages={activeChat.messages}
                typingUsers={activeChat.typingUsers}
              />
              <MessageInput
                user={user}
                activeChat={activeChat}
                sendMessage = {
                  (message) => {
                    this.sendMessage(activeChat.id, message)
                  }
                }
                sendTyping={
                  (isTyping) => {
                    this.sendTyping(activeChat.id, isTyping)
                  }
                }
              />
            </div>
            ) :
            <div className="chat-room choose">
              <h3>Click on a user to start chatting!</h3>
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username,
    users: state.chat.users,
    chats: state.chat.chats,
    activeChat: state.chat.activeChat
  };
}

export default connect(mapStateToProps, actions)(ChatContainer);
