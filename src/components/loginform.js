import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';
import { VERIFY_USER } from '../events';

export class LoginForm extends Component {
  handleFormSubmit({ username, password }) {
    const { socket } = this.props;
    socket.emit(VERIFY_USER, username);
    this.props.loginUser({ username, password });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      <div className="alert alert-danger">
        <strong>Oops!</strong> {this.props.errorMessage}
      </div>
    }
  }

  render() {
    const { handleSubmit, fields: { username, password } } = this.props;
    return (
      <div className="login">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label>Username:</label>
            <Field name="username" placeholder="enter a username" component="input" type="text" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label>Password:</label>
            <Field name="password" placeholder="enter a password" component="input" type="password" className="form-control" />
          </fieldset>
          {this.renderAlert()}
          <button action="submit" className="btn btn-primary">Sign in</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'loginForm',
  fields: ['username', 'password']
})(
  connect(mapStateToProps, actions)(LoginForm)
);
