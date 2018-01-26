import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/lib/fa';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import '../../style/modal.css';
import Modal from 'react-responsive-modal/lib/css';
import UserList from '../sidebar/userlist';

class AddPersonModal extends Component {
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

  render() {
    const { show } = this.state
    const { user, users, chats, onSendPrivateMessage } = this.props;
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
              <UserList onSendPrivateMessage={onSendPrivateMessage} user={user} users={users} chats={chats} />
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}

function addStateToProps(state) {
  return {
    user: state.auth.username,
    users: state.chat.users,
    chats: state.chat.chats
  };
}

export default connect(addStateToProps, null)(AddPersonModal);
