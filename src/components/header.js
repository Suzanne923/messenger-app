import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../actions';
import { FaSignOut } from 'react-icons/lib/fa';
import '../style/header.css';

class Header extends Component {
  handleClick = () => {
    const { logoutUser, socket } = this.props;
    logoutUser(() => {
      socket.disconnect()
    });
  }

  render() {
    const { user, authenticated, base64 } = this.props;
    const itemStyle = {
      backgroundImage: `url(${base64})`,
    }

    return (
      <div className="navbar navbar-light">
        <div className="container">
          <div className="avatar" style={itemStyle}></div>
          <div className="current-user">{user}</div>
          {authenticated ?
            <Link onClick={this.handleClick} className="nav-link logout" to="/">
              <i className="logout-icon"><FaSignOut /></i>
              Logout
            </Link>
           : null }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.username,
    authenticated: state.auth.authenticated,
    base64: state.auth.base64
  };
}

export default connect(mapStateToProps, actions)(Header);
