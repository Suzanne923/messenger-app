import React, { Component } from 'react';
import AddUserModal from './add-user-modal'
import Dropdown from './dropdown';
import { FaAngleLeft, FaAngleRight } from 'react-icons/lib/fa';

class ChatHeading extends Component {
  render() {
    const { toggle, showSidebar, users, onAddUserToChat, onRemoveUser, onLeaveChat } = this.props;

    return (
      <div className="chat-header">
        <i onClick={toggle} className="arrow-icon">
          {
            showSidebar ? <FaAngleLeft /> : <FaAngleRight />
          }
        </i>
        <div className="user-name">{ users.join(', ') || "Community" }</div>
        <div className="buttons-bar">
          <AddUserModal onAddUserToChat={onAddUserToChat} />
          <Dropdown
            onRemoveUser={onRemoveUser}
            onLeaveChat={onLeaveChat}
          />
        </div>
      </div>
    );
  }
}

export default ChatHeading;
