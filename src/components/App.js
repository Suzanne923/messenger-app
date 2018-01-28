import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { browserHistory } from 'react-router';

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.fetchUser(token);
    } else {
      browserHistory.push('/login');
    }
  }

  render() {
    const { user } = this.props
    return (
      <div>
        {
          this.props.user ?
            <div>
              {this.props.children}
            </div>
          : null
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
