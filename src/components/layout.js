import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';
import { VERIFY_USER } from '../events';
import LoginForm from './loginform';
import ChatContainer from './chat-container';

const socketUrl = "localhost:3230";

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
      if (this.props.user) {
        this.reconnect(socket);
      } else {
        console.log("Connected");
      }
    });
    this.setState({ socket });
  };

  reconnect = (socket) => {
    socket.emit(VERIFY_USER, this.props.user, ({ isUser, user}) => {
      if (isUser) {
        this.props.loginUser({ user });
      }
    });
  };

  render() {
    const { title, user } = this.props;
    const { socket } = this.state;
    return (
      <div className="container">
        <h2>{title}</h2>
        {
          !user ?
          <ChatContainer socket={socket} />
          :
          <LoginForm socket={socket} />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username
  };
}

export default connect(mapStateToProps, actions)(Layout);
