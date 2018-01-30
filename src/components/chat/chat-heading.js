import React from 'react';
import AddUserModal from './add-user-modal'
import Dropdown from './dropdown';

export default ({
  users,
  onAddUserToChat,
  onRemoveUser,
  onLeaveChat
}) => {
  return (
    <div className="chat-header">
      <div className="user-name">{ users.join(', ') || "Community" }</div>
      <Dropdown
        onRemoveUser={onRemoveUser}
        onLeaveChat={onLeaveChat}
      />
      <AddUserModal onAddUserToChat={onAddUserToChat} />
    </div>
  );
}
