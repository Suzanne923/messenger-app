import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class SideBar extends Component {
  render() {
    const { users } = this.props;

    const UserList = () => {
      if (users) {
        return (
          users.map((user, i) => (
            <li key={i}>
              <button className="user-button">{user}</button>
            </li>
          ))
        );
      } else {
        return (
          <li>No users online</li>
        );
      }
    }

    return (
      <div className="sidebar bg-success">
        <div className="heading">
          <h4>Online Users</h4>
        </div>
        <div className="search">
          <i className="search-icon"></i>
          <input className="search-bar" placeholder="Search users" type="text" />
        </div>
        <ul className="user-list">
          <UserList />
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.chat.users
  }
}

export default connect (mapStateToProps, actions)(SideBar);
