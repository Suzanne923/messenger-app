import React from 'react';
import AddPersonModal from './add-person-modal'

export default ({name, onSendPrivateMessage }) => {
  return (
    <div className="chat-header">
      <div className="user-name">{name}</div>
      <AddPersonModal onSendPrivateMessage={onSendPrivateMessage} />
    </div>
  );
}
