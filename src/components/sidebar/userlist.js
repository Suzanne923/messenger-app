import React, { Component } from 'react';
import '../../style/sidebar.css';

class UserList extends Component {
  addPerson(e, user) {
    const receiver = e.currentTarget.dataset.id;
    const objArray = this.props.chats.map(c => c.name);
    console.log(this.props.chats.map(c => c.name), user)
    if (!objArray.includes(user)) {
      this.props.onSendPrivateMessage(receiver);
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
                <li onClick={(e) => {this.addPerson(e, u)}} data-id={u} key={i}>
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
