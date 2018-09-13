import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/lib/fa';
import Modal from 'react-responsive-modal/lib/css';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import '../../style/modal.css';

class AddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  addUser(e, user) {
    const { activeChat, onAddUserToChat } = this.props;
    const activeChatUsers = activeChat.users.map(u => u.name);
    if (!activeChatUsers.includes(user) && activeChat.name !== "Community") {
      const receiver = e.currentTarget.dataset.id;
      onAddUserToChat(receiver);
    }
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    const { show } = this.state;
    const {
      user,
      users,
      activeChat
    } = this.props;
    const activeChatUsers = activeChat.users.map(u => u.name);

    const UserList = () => (
      <ul className="user-list">
        {
          users.map((u) => {
            if (u.name !== user) {
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    className="add-user-btn"
                    onClick={(e) => { this.addUser(e, u.name); }}
                    data-id={u.name}
                    key={u.id}
                  >
                    <span className="dot-icon" />
                    <div className="user-list-item">
                      {u.name}
                      { activeChatUsers.includes(u) ? <span className="added">Added</span> : null }
                    </div>
                  </button>
                </li>
              );
            }
            return null;
          })
        }
      </ul>
    );

    return (
      <div>
        <button className="icon-btn plus-btn" type="button" onClick={this.handleShow}>
          <i className="plus-icon"><FaPlus /></i>
        </button>
        <Modal className="modal-container" showCloseIcon={false} open={show} onClose={this.handleClose} little>
          <div className="modal-header">
            <button type="button" onClick={this.handleClose} className="modal-cancel modal-btn">Cancel</button>
            <p className="modal-title">Add more people</p>
            <button type="button" onClick={this.handleClose} className="modal-done modal-btn">Done</button>
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

AddUserModal.propTypes = {
  activeChat: PropTypes.any.isRequired,
  onAddUserToChat: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  user: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  activeChat: state.chat.activeChat,
  user: state.auth.username,
  users: state.chat.users,
  chats: state.chat.chats
});

export default connect(mapStateToProps, null)(AddUserModal);
