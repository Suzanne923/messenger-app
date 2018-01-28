import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class App extends Component {

  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      // send token to db, db checks id in token and sends back the user
      console.log('token found, fetching user...');
      this.props.fetchUser();
    } else {
      console.log('no token found');
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect (null, actions)(App);
