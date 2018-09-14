import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-css-transition';
import { FaSearch, FaCog } from 'react-icons/lib/fa';
import UserList from './userlist';
import '../../style/sidebar.css';

CSSTransition.childContextTypes = { /* child context keys */ };

const transitionStyles = {
  defaultStyle: { width: '0' },
  enterStyle: {
    width: '100%',
    transition: "width 500ms ease-in-out"
  },
  leaveStyle: {
    width: '0',
    transition: "width 400ms ease-in-out"
  },
  activeStyle: { width: '100%' }
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }

  handleChange = (e) => {
    this.setState({ search: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const {
      show,
      user,
      users,
      chats,
      activeChat,
      onSendPrivateMessage,
      onSetActiveChat
    } = this.props;
    const { search } = this.state;
    const filteredChats = chats.filter((chat) => {
      if (search !== "") {
        return chat.users.map(u => u.name).includes(search);
      }
      return chat;
    });

    const ChatList = () => filteredChats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      let chatName;
      chat.users.forEach((chatuser) => {
        if (chatuser.name !== user) {
          chatName = chatName ? chatName.concat(`, ${chatuser.name}`) : chatuser.name;
        }
      });
      const chatSideName = chatName || "Community";
      const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : '';

      return (chat.name) && (
        <li key={chat.id}>
          <button className={`chat-list-item ${classNames}`} type="button" onClick={() => { onSetActiveChat(chat); }}>
            <div className="chat-info">
              <div className="chat-icon">{chatSideName[0].toUpperCase()}</div>
              <div className="name">{chatSideName}</div>
            </div>
            {lastMessage && <div className="last-message">{lastMessage.message}</div>}
          </button>
        </li>
      );
    });

    return (
      <CSSTransition className="sidebar-container" {...transitionStyles} active={show}>
        <div className="sidebar">
          <div className="heading">
            <i className="cog-icon"><FaCog /></i>
            <h6 className="heading-title">Message</h6>
          </div>
          <form onSubmit={this.handleSubmit} className="search">
            <input
              className="search-bar"
              placeholder="Search users"
              type="text"
              value={search}
              onChange={this.handleChange}
            />
            <i className="search-icon"><FaSearch /></i>
          </form>
          <p className="users">Active chats:</p>
          <ul ref="users" className="chat-list">
            <ChatList />
          </ul>
          <p className="list-heading">Online users:</p>
          <UserList onSendPrivateMessage={onSendPrivateMessage} user={user} users={users} chats={chats} />
        </div>
      </CSSTransition>
    );
  }
}

SideBar.propTypes = {
  socket: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  chats: PropTypes.arrayOf(PropTypes.any).isRequired,
  activeChat: PropTypes.object.isRequired
};

export default SideBar;
