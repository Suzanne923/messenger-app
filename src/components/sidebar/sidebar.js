import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaCog } from 'react-icons/lib/fa';
import UserList from './userlist';
import { CSSTransition } from 'react-css-transition';
import '../../style/sidebar.css';

CSSTransition.childContextTypes = {
    //child context keys
}

const transitionStyles = {
  defaultStyle: {
    width: '0'
  },
  enterStyle: {
    width: '100%',
    transition: "width 500ms ease-in-out"
  },
  leaveStyle: {
    width: '0',
    transition: "width 400ms ease-in-out",
  },
  activeStyle: {
    width: '100%'
  },
};


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

  handleChange = (e) => {
    this.setState({ search: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const { show, user, users, chats, activeChat, onSendPrivateMessage, onSetActiveChat } = this.props;
    const filteredChats = this.props.chats.filter(chat => {
      if (this.state.search !== "") {
        console.log(chat.users);
        return chat.users.map(u => u.name).includes(this.state.search);
      } else {
        return chat;
      }
    });

    const ChatList = () => filteredChats.map((chat, i) => {
      if (chat.name) {
        const lastMessage = chat.messages[chat.messages.length-1];
        let chatName;
        chat.users.forEach((chatuser) => {
          if (chatuser.name !== user) {
            chatName = chatName ? chatName.concat(`, ${chatuser.name}`) : chatuser.name;
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
            value={this.state.search}
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

export default SideBar;
