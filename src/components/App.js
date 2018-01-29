import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class App extends Component {
  componentDidMount() {
    const { fetchUser } = this.props;
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }

  render() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default connect(null, actions)(App);
