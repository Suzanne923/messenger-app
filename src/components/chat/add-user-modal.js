import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/lib/fa';
import Modal from 'react-responsive-modal/lib/css';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import '../../style/modal.css';
import '../../style/sidebar.css';

class AddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false }
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  handleClose = () => {
    this.setState({ show: false });
  }

  addUser(e, user) {
    const { activeChat, onAddUserToChat } = this.props
    if (!activeChat.users.includes(user)) {
      const receiver = e.currentTarget.dataset.id;
      onAddUserToChat(receiver);
    }
  }

  render() {
    const { show } = this.state
    const { user, users, activeChat } = this.props;

    const UserList = () => {
      return (
        <ul className="user-list">
          {
            users.map((u, i) => {
              if (u !== user) {
                return (
                  <li onClick={(e) => {this.addUser(e, u)}} data-id={u} key={i}>
                    <span className="dot-icon"></span>
                    <div className="user-list-item">
                      {u}
                      { activeChat.users.includes(u) ? <span className="added">Added</span> : null }
                    </div>

                  </li>
                );
              } else { return null; }
            })
          }
        </ul>
      );
    }

    return (
      <div>
        <i className="plus-icon" onClick={this.handleShow}><FaPlus /></i>
        <Modal className="modal-container" showCloseIcon={false} open={show} onClose={this.handleClose} little>
          <div className="modal-header">
            <button onClick={this.handleClose} className="modal-cancel modal-btn">Cancel</button>
            <p className="modal-title">Add more people</p>
            <button onClick={this.handleClose} className="modal-done modal-btn">Done</button>
          </div>
          <div className="modal-body">
            <p className="users">Online users:</p>
            <ul className="user-list">
              <UserList />
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}

function addStateToProps(state) {
  return {
    activeChat: state.chat.activeChat,
    user: state.auth.username,
    users: state.chat.users,
    chats: state.chat.chats
  };
}

export default connect(addStateToProps, null)(AddUserModal);
