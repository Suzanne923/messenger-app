import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../style/userlist.css';

class UserList extends Component {
  startPrivateChat(e, user) {
    const { chats, onSendPrivateMessage } = this.props;
    const receiver = e.currentTarget.dataset.id.toString();
    const chatNames = chats.map(c => c.name);

    if (chatNames.indexOf(user) < 0 && chatNames.indexOf(receiver) < 0) {
      onSendPrivateMessage(receiver);
    }
  }

  render() {
    const { user, users } = this.props;
    // eslint-disable-next-line
    const usersList = users.map((u) => {
      return (u.name !== user) && (
        <li key={u.id}>
          <button
            type="button"
            className="add-user-btn"
            data-id={u.name}
            onClick={(e) => { this.startPrivateChat(e, user); }}
          >
            <span className="dot-icon" />
            <div className="user-list-item">
              <div className="user-name">{u.name}</div>
            </div>
          </button>
        </li>
      );
    });

    return (
      <ul className="user-list">
        {usersList}
      </ul>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  chats: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSendPrivateMessage: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired
};

export default UserList;
