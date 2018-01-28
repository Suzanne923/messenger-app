import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import LoginForm from './loginform';

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.fetchUser(token);
    }
  }

  render() {
    const { user } = this.props
    return (
      <div>
        {
          user ?
            <div>
              {this.props.children}
            </div>
          : <LoginForm />
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

export default connect(mapStateToProps, actions)(App);
