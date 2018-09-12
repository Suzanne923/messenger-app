import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FaSignOut } from 'react-icons/lib/fa';
import * as actions from '../actions';
import '../style/header.css';

class Header extends Component {
  handleClick = () => {
    const { logoutUser, socket } = this.props;

    logoutUser(() => {
      socket.disconnect();
    });
  }

  render() {
    const {
      user,
      authenticated,
      base64
    } = this.props;
    const itemStyle = { backgroundImage: `url(${base64})` };

    return (
      <div className="navbar navbar-light">
        <div className="container">
          <div className="avatar" style={itemStyle} />
          <div className="current-user">{user}</div>
          { authenticated ? (
            <Link onClick={this.handleClick} className="nav-link logout" to="/">
              <i className="logout-icon"><FaSignOut /></i>
              <span>Logout</span>
            </Link>
          ) : null }
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  base64: PropTypes.string
};

Header.defaultProps = { base64: '' };

const mapStateToProps = state => ({
  user: state.auth.username,
  authenticated: state.auth.authenticated,
  base64: state.auth.base64
});

export default connect(mapStateToProps, actions)(Header);
