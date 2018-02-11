import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';
import { USER_CONNECTED } from '../events';
import ChatContainer from './chat/chat-container';
import Header from './header';
import '../style/layout.css';
import '../style/index.css';

const socketUrl = window.location.hostname.includes('localhost') ? 'http://localhost:3230' : `${window.location.protocol}//${window.location.hostname}`;

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
    const { user } = this.props;
    const { socket } = this.state;
    if (!socket) {
      const socket = io(socketUrl);
      socket.on('connect', () => {
        socket.emit(USER_CONNECTED, user);
      });
      this.setState({ socket });
    }
  };

  render() {
    const { socket } = this.state;
    return (
      <div className="outer-container">
        <Header socket={ socket} />
        <ChatContainer socket={socket} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username,
  };
}

export default connect(mapStateToProps, actions)(Layout);
