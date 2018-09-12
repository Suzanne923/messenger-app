import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { children } = this.props;
    return (
      <div className="app">
        {children}
      </div>
    );
  }
}

App.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

export default connect(null, actions)(App);
