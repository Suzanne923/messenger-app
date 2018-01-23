import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { LOGOUT } from '../events';
import SideBar from './sidebar';

class ChatContainer extends Component {

  logout = () => {
    const { socket } = this.props;
    socket.emit(LOGOUT);
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props;
    return (
      <div className="container chat-container">
        <SideBar />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username,
    chats: state.chat.chats,
    activeChat: state.chat.activeChat
  };
}

export default connect(mapStateToProps, actions)(ChatContainer);
