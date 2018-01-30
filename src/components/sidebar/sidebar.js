import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaCog } from 'react-icons/lib/fa';
import '../../style/sidebar.css';
import UserList from './userlist';

class SideBar extends Component {
  static propTypes = {
    socket: PropTypes.object,
    user: PropTypes.string,
    users: PropTypes.array,
    chats: PropTypes.array,
    activeChat: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: ""
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const { show, user, users, chats, activeChat, onSendPrivateMessage, onSetActiveChat } = this.props;

    const ChatList = () => chats.map((chat, i) => {
      if (chat.name) {
        const lastMessage = chat.messages[chat.messages.length-1];
        let chatName;
        chat.users.forEach((name) => {
          if (name !== user) {
            chatName = chatName ? chatName.concat(`, ${name}`) : name;
          }
        });
        const chatSideName = chatName || "Community";
        const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : '';
        return (
          <li key={chat.id}
            className={`chat-list-item ${classNames}`}
            onClick={ () => { onSetActiveChat(chat) } }
          >
            <div className="chat-info">
              <div className="chat-icon">{chatSideName[0].toUpperCase()}</div>
              <div className="name">{chatSideName}</div>
            </div>
            {lastMessage && <div className="last-message">{lastMessage.message}</div>}
          </li>
        );
      }
      return null;
    });

    return (
      <div className={`sidebar ${show && 'hidden'}`}>
        <div className="heading">
          <i className="cog-icon"><FaCog /></i>
          Messenger
        </div>
        <form onSubmit={this.handleSubmit} className="search">
          <input
            className="search-bar"
            placeholder="Search users"
            type="text"
          />
          <i className="search-icon"><FaSearch /></i>
        </form>
        <p className="users">Active chats:</p>
        <ul ref="users" className="chat-list">
          <ChatList />
        </ul>
        <p className="users">Online users:</p>
        <UserList onSendPrivateMessage={onSendPrivateMessage} user={user} users={users} chats={chats} />
      </div>
    );
  }
}

export default SideBar;
