import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { USER_CONNECTED, LOGOUT, MESSAGE_SENT, MESSAGE_RECEIVED, TYPING,
  COMMUNITY_CHAT, PRIVATE_MESSAGE } from '../events';
import SideBar from './sidebar';
import ChatHeading from './chat/chat-heading';
import Messages from './chat/messages';
import MessageInput from './chat/message-input';

import '../style/chatroom.css';

class ChatContainer extends Component {

  componentWillMount() {
    const { socket } = this.props;
    this.initSocket(socket);
  }

  initSocket(socket) {
    socket.on(PRIVATE_MESSAGE, this.addChat);
    socket.on(USER_CONNECTED, this.fetchUsers);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat);
    });
  }

  fetchUsers = (connectedUsers) => {
    const users = Object.keys(connectedUsers);
    this.props.fetchUsers(users);
  }

  sendOpenPrivateMessage = (receiver) => {
    const { socket, user, activeChat } = this.props;
    socket.emit(PRIVATE_MESSAGE, { receiver, sender: user, activeChat });
  }

  logout = () => {
    const { socket } = this.props;
    socket.emit(LOGOUT);
    this.props.logoutUser();
  };

  resetChat = (chat) => {
    return this.addChat(chat, true);
  }

  addChat = (chat, reset = false) => {
    const { socket } = this.props;
    if (reset) {
      this.props.resetChat();
      this.props.setActiveChat(chat);
    }
    this.props.addChat(chat);

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;

    socket.on(messageEvent, this.addMessageToChat(chat.id))
    socket.on(typingEvent, this.updateTypingInChat(chat.id));
  }

  addMessageToChat = (chatId) => {
    return (message) => {
      this.props.addMessageToChat(chatId, message);
    }
  }

  updateTypingInChat = (chatId) => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user) {
        this.props.updateTypingInChat(isTyping, chatId, user);
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
    const { user, users, chats, activeChat, socket } = this.props;
    return (
      <div className="container chat-container">
        <SideBar
          socket={socket}
          users={users}
          user={user}
          chats={chats}
          activeChat={activeChat}
          onSendPrivateMessage={this.sendOpenPrivateMessage}
          onSetActiveChat={this.props.setActiveChat}
        />
        <div className="chatbox">
          {activeChat.name ? (
            <div className="chat-room">
              <ChatHeading
                name={activeChat.name}
                onSendPrivateMessage={this.sendOpenPrivateMessage}
              />
              <Messages
                activeChat={activeChat}
                messages={activeChat.messages}
                typingUsers={activeChat.typingUsers}
                user={user}
              />
              <MessageInput
                activeChat={activeChat}
                user={user}
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
