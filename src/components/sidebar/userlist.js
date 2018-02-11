import React, { Component } from 'react';
import '../../style/userlist.css';

class UserList extends Component {
  static defaultProps = {
    users: []
  }

  startPrivateChat(e, user) {
    const { chats, onSendPrivateMessage } = this.props
    const receiver = e.currentTarget.dataset.id.toString();
    const chatNames = chats.map(c => c.name);
    if (chatNames.indexOf(user) < 0 && chatNames.indexOf(receiver) < 0) {
      onSendPrivateMessage(receiver);
    }
  }

  render() {
    const { user, users } = this.props
    return (
      <ul className="user-list">
        {
          users.map((u, i) => {
            if (u.name !== user) {
              return (
                <li onClick={(e) => {this.startPrivateChat(e, user)}} data-id={u.name} key={i}>
                  <span className="dot-icon"></span>
                  <div className="user-list-item">
                    <div className="user-name">{u.name}</div>
                    </div>
                </li>
              );
            } else { return null; }
          })
        }
      </ul>
    )
  }
}

export default UserList;
