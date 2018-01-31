import React, { Component } from 'react';
import '../../style/sidebar.css';

class UserList extends Component {
  static defaultProps = {
    users: []
  }

  startPrivateChat(e, user) {
    const { chats, onSendPrivateMessage } = this.props
    const receiver = e.currentTarget.dataset.id.toString();
    const chatNames = chats.map(c => c.name);
    console.log(receiver, user, chatNames.indexOf(user) < 0, chatNames.indexOf(receiver) < 0);
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
            if (u !== user) {
              return (
                <li onClick={(e) => {this.startPrivateChat(e, user)}} data-id={u} key={i}>
                  <span className="dot-icon"></span>
                  <div className="user-list-item">
                    <div className="user-name">{u}</div>
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
