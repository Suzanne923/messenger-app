import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import * as actions from '../actions';

class LoginForm extends Component {
  handleFormSubmit({ username, password }) {
    this.props.loginUser({ username, password });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="login-container">
        <div className="login">
          <h4 className="login-title">Login to start chatting!</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group">
              <Field name="username" placeholder="Username" component="input" type="text" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <Field name="password" placeholder="Password" component="input" type="password" className="form-control" />
            </fieldset>
            {this.renderAlert()}
            <button action="submit" className="btn btn-success login-button">Login</button>
          </form>
          <Link to="/register" className="register-link">Create an Account</Link>
        </div>
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
