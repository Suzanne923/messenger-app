import React, { Component } from 'react';
import '../../style/sidebar.css';

class UserList extends Component {
  startPrivateChat(e, user) {
    const { chats, onSendPrivateMessage } = this.props
    const receiver = e.currentTarget.dataset.id;
    const objArray = chats.map(c => c.name);
    if (!objArray.includes(user)) {
      onSendPrivateMessage(receiver);
    }
  }

  render() {
    const { user, users } = this.props
    return (
      <ul className="user-list">
        {
          users.map((u, i) => {
            if (u !== user) {
              return (
                <li onClick={(e) => {this.startPrivateChat(e, u)}} data-id={u} key={i}>
                  <span className="dot-icon"></span>
                  <div className="user-list-item">{u}</div>
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
