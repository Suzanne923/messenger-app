import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaAngleLeft, FaAngleRight } from 'react-icons/lib/fa';
import AddUserModal from './add-user-modal';
import Dropdown from './dropdown';
import '../../style/chat-heading.css';

class ChatHeading extends Component {
  render() {
    const {
      users,
      toggle,
      showSidebar,
      onAddUserToChat,
      onRemoveUser,
      onLeaveChat
    } = this.props;

    const chatUsers = users.map(u => u.name);

    return (
      <div className="chat-header">
        <button type="button" onClick={toggle}>
          <i className="arrow-icon">
            { showSidebar ? <FaAngleLeft /> : <FaAngleRight /> }
          </i>
        </button>
        <div className="chat-name">{ chatUsers.join(', ') || "Community" }</div>
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

ChatHeading.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  showSidebar: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onAddUserToChat: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
  onLeaveChat: PropTypes.func.isRequired
};

export default ChatHeading;
