import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../events';
import LoginForm from './loginform';

const socketUrl = "/";

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      if (this.props.username) {
        this.reconnect(socket);
      } else {
        console.log("Connected");
      }
    });
    this.setState({ socket });
  };

  reconnect = (socket) => {
    socket.emit(VERIFY_USER, this.props.username, ({ isUser, user}) => {
      if (isUser) {
        this.props.loginUser({ user });
      }
    });
  };

  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED);
    this.props.loginUser(user);
  };

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.props.logoutUser();
  };

  render() {
    const { title } = this.props;
    return (
      <div className="container">
        <h2>{title}</h2>
        <LoginForm socket={this.state.socket} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.auth.username
  };
}

export default connect(mapStateToProps, actions)(Layout);
