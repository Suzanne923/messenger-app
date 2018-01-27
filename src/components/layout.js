import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';
import { USER_CONNECTED } from '../events';
import ChatContainer from './chat-container';
import '../style/index.css';
import Header from './header';

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
    const token = localStorage.getItem('token');
    if (token) {
      // send token to db, db checks id in token and sends back the user
      console.log('token found, fetching user...');
      this.props.fetchUser();
      store.dispatch({ type: AUTH_USER });
    } else {
      console.log('no token found');
    }
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      if (this.props.authenticated) {
        console.log(this.props.user);
        socket.emit(USER_CONNECTED, this.props.user);
      } else {
        this.props.reconnectUser(this.props.user, () => {
          socket.emit(USER_CONNECTED, this.props.user);
        });
      }

    });
    this.setState({ socket });
  };

  render() {
    const { socket } = this.state;
    return (
      <div>
        <Header socket={ socket} />
        <div className="container outer-container">
          <ChatContainer socket={socket} />
        </div>
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
