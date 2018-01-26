import React, { Component } from 'react';
import { FaSearch, FaCog } from 'react-icons/lib/fa';
import '../style/sidebar.css';
import UserList from './sidebar/userlist';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: ""
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { receiver } = this.state;
    const { onSendPrivateMessage } = this.props;

    onSendPrivateMessage(receiver);
  }

  render() {
    const { chats, user, users, activeChat, onSendPrivateMessage } = this.props;
    const { receiver } = this.state;

    const ChatList = () => chats.map((chat, i) => {
      if (chat.name) {
        const lastMessage = chat.messages[chat.messages.length-1];
        const chatSideName = chat.users.find((name) => {
          return name !== user
        }) || "Community";
        const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : '';
        return (
          <li key={chat.id}
            className={`chat-list-item ${classNames}`}
            onClick={ () => { this.props.onSetActiveChat(chat) } }
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
      <div className="sidebar">
        <div className="heading">
          <i className="cog-icon"><FaCog /></i>
          Online Users
        </div>
        <form onSubmit={this.handleSubmit} className="search">
          <input
            className="search-bar"
            placeholder="Search users"
            type="text"
            value={receiver}
            onChange={(e) => { this.setState({receiver: e.target.value}) }}
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
