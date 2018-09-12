import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_SENT,
  MESSAGE_RECEIVED,
  TYPING,
  PRIVATE_MESSAGE,
  NEW_USER_ADDED,
  USER_REMOVED
} from '../../events';

import SideBar from '../sidebar/sidebar';
import ChatHeading from './chat-heading';
import Messages from './messages';
import MessageInput from './message-input';
import '../../style/chat-container.css';

class ChatContainer extends Component {
  static defaultProps = {
    users: [],
    chats: [],
    activeChat: {}
  }

  constructor(props) {
    super(props);
    this.state = { showSidebar: true };
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
    socket.off(COMMUNITY_CHAT);
    socket.emit(LOGOUT);
  }

  toggleSidebar = () => {
    const { showSidebar } = this.state;
    this.setState({ showSidebar: !showSidebar });
  };

  initSocket(socket) {
    const { addUserToChat, removeUserFromChat } = this.props;

    socket.on(USER_CONNECTED, this.addUser);
    socket.on(USER_DISCONNECTED, this.removeUser);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat);
    });
    socket.on(PRIVATE_MESSAGE, this.receivedPrivateMessage);
    socket.on(NEW_USER_ADDED, addUserToChat);
    socket.on(USER_REMOVED, removeUserFromChat);
  }

  receivedPrivateMessage = (chat) => {
    const { user, users } = this.props;

    if (!chat.users.map(u => u.name).includes(user)) {
      chat.users.push(users.find(u => u.name === user));
    }
    this.addChat(chat);
  }

  addUser = (newUser, connectedUsers) => {
    const { addUser } = this.props;

    Object.keys(connectedUsers).forEach((user) => {
      const currentUser = connectedUsers[user];
      addUser(currentUser);
    });
  };

  removeUser = (onlineUsers) => {
    const {
      removeUserFromChat,
      removeUser,
      users
    } = this.props;
    const removedUser = users.find(u => (!onlineUsers.includes(u.name)));

    if (removedUser) {
      removeUserFromChat(removedUser);
      removeUser(removedUser.name);
    }
  };

  leaveChat = () => {
    const {
      socket,
      activeChat,
      user,
      removeChat
    } = this.props;

    socket.emit(USER_REMOVED, { user, activeChat });
    removeChat(activeChat);
  };

  addUserToChat = (newUser) => {
    const {
      socket,
      users,
      activeChat,
      addUserToChat
    } = this.props;

    socket.emit(NEW_USER_ADDED, { newUser, activeChat });
    addUserToChat(activeChat.id, users.find(u => u.name === newUser));
  };

  removeUserFromChat = (removedUser) => {
    const { socket, activeChat } = this.props;

    socket.emit(USER_REMOVED, { removedUser, activeChat });
  };

  resetChat = chat => this.addChat(chat, true);

  addChat = (chat, reset = false) => {
    const {
      socket,
      resetChat,
      setActiveChat,
      addChat
    } = this.props;

    if (reset) {
      resetChat();
      setActiveChat(chat);
    }
    addChat(chat);

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;
    socket.on(messageEvent, this.addMessageToChat(chat.id));
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
      // eslint-disable-next-line
      if (user.name !== this.props.user) {
        updateTypingInChat(isTyping, chatId, user);
      }
    };
  }

  sendMessage = (chatId, message) => {
    const { socket } = this.props;

    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;

    socket.emit(TYPING, { chatId, isTyping });
  };

  logout = () => {
    const {
      socket,
      user,
      logoutUser,
      removeUser
    } = this.props;

    socket.emit(LOGOUT);
    removeUser(user);
    logoutUser();
  };

  render() {
    const {
      socket,
      user,
      users,
      chats,
      activeChat,
      setActiveChat
    } = this.props;
    const { showSidebar } = this.state;

    return (
      <div className="container chat-container">
        <SideBar
          show={showSidebar}
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
              showSidebar={showSidebar}
              toggle={this.toggleSidebar}
              users={activeChat.users}
              onAddUserToChat={this.addUserToChat}
              onRemoveUser={this.removeUserFromChat}
              onLeaveChat={this.leaveChat}
            />
            <Messages
              user={user}
              users={users}
              messages={activeChat.messages}
              typingUsers={activeChat.typingUsers}
            />
            <MessageInput
              user={user}
              activeChat={activeChat}
              sendMessage={(message) => { this.sendMessage(activeChat.id, message); }}
              sendTyping={(isTyping) => { this.sendTyping(activeChat.id, isTyping); }}
            />
          </div>
        ) : (
          <div className="chat-room choose">
            <h4>Click on a user to start chatting!</h4>
          </div>
        )}
      </div>
    );
  }
}

ChatContainer.propTypes = {
  user: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.any),
  chats: PropTypes.arrayOf(PropTypes.any),
  activeChat: PropTypes.object,
  socket: PropTypes.object.isRequired,
  addUserToChat: PropTypes.func.isRequired,
  removeUserFromChat: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  removeChat: PropTypes.func.isRequired,
  resetChat: PropTypes.func.isRequired,
  setActiveChat: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
  addMessageToChat: PropTypes.func.isRequired,
  updateTypingInChat: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.username,
  users: state.chat.users,
  chats: state.chat.chats,
  activeChat: state.chat.activeChat
});

export default connect(mapStateToProps, actions)(ChatContainer);
