import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { difference } from 'lodash';
import { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECEIVED, TYPING,
  PRIVATE_MESSAGE, NEW_USER_ADDED, USER_REMOVED } from '../events';

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

  constructor(props) {
    super(props);
    this.state = {
      showSidebar: true
    }
  }

  componentWillMount() {
    const { socket } = this.props;
    this.initSocket(socket);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off(USER_CONNECTED);
    socket.off(USER_DISCONNECTED);
    socket.off(PRIVATE_MESSAGE);
    socket.off(NEW_USER_ADDED);
    socket.off(USER_REMOVED);
  }

  toggleSidebar = () => {
    const { showSidebar } = this.state;
    this.setState({ showSidebar: !showSidebar })
  }

  initSocket(socket) {
    socket.on(USER_CONNECTED, this.fetchUsers);
    socket.on(USER_DISCONNECTED, this.removeUser);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat);
    });
    socket.on(PRIVATE_MESSAGE, this.addChat);
    socket.on(NEW_USER_ADDED, this.props.addUserToChat);
    socket.on(USER_REMOVED, this.props.removeUserFromChat);
  }

  fetchUsers = (connectedUsers) => {
    const { fetchUsers } = this.props;
    const users = Object.keys(connectedUsers);
    fetchUsers(users);
  };

  removeUser = (onlineUsers) => {
    const { fetchUsers, removeUserFromChat } = this.props;
    const removedUser = difference(this.props.users, onlineUsers);
    fetchUsers(onlineUsers);
    removeUserFromChat(removedUser[0]);
  };

  leaveChat = () => {
    const { socket, activeChat, user, removeChat } = this.props;
    socket.emit(USER_REMOVED, { user, activeChat });
    removeChat(activeChat);
  };

  addUserToChat = (newUser) => {
    const { socket, activeChat } = this.props;
    socket.emit(NEW_USER_ADDED, { newUser, activeChat });
  };

  removeUserFromChat = (removedUser) => {
    const { socket, activeChat } = this.props;
    socket.emit(USER_REMOVED, { removedUser, activeChat });
  };

  resetChat = (chat) => {
    return this.addChat(chat, true);
  };

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
  };

  sendOpenPrivateMessage = (receiver) => {
    const { socket, user } = this.props;
    socket.emit(PRIVATE_MESSAGE, { receiver, sender: user });
  };

  addMessageToChat = (chatId) => {
    const { addMessageToChat } = this.props;
    return (message) => {
      addMessageToChat(chatId, message);
    };
  };

  updateTypingInChat = (chatId) => {
    const { updateTypingInChat } = this.props;
    return ({ isTyping, user }) => {
      if (user !== this.props.user) {
        updateTypingInChat(isTyping, chatId, user);
      }
    };
  }

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, {chatId, message});
  };

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, {chatId, isTyping});
  };

  logout = () => {
    const { socket, logoutUser } = this.props;
    socket.emit(LOGOUT);
    logoutUser();
  };

  render() {
    const { socket, user, users, chats, activeChat, setActiveChat } = this.props;

    return (
      <div className="container chat-container">
        <SideBar
          show={this.state.showSidebar}
          socket={socket}
          user={user}
          users={users}
          chats={chats}
          activeChat={activeChat}
          onSendPrivateMessage={this.sendOpenPrivateMessage}
          onSetActiveChat={setActiveChat}
        />
        {activeChat.name ? (
          <div className="chat-room">
            <ChatHeading
              showSidebar={this.state.showSidebar}
              toggle={this.toggleSidebar}
              users={activeChat.users}
              onAddUserToChat={this.addUserToChat}
              onRemoveUser={this.removeUserFromChat}
              onLeaveChat={this.leaveChat}
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
            <h4>Click on a user to start chatting!</h4>
          </div>
        }
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
