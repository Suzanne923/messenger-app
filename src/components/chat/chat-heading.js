import React from 'react';
import AddUserModal from './add-user-modal'

export default ({name, onAddUserToChat }) => {
  return (
    <div className="chat-header">
      <div className="user-name">{name}</div>
      <AddUserModal onAddUserToChat={onAddUserToChat} />
    </div>
  );
}
