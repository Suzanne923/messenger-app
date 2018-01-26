import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';

class RegisterForm extends Component {

  handleFormSubmit({ username, password }) {
    this.props.registerUser({ username, password });
  }

  renderField({ input, name, label, type, meta: { touched, error } }) {
    return (
      <fieldset className="form-group">
        <input {...input} name={name} placeholder={label} type={type} className="form-control" />
        {touched && error && <div className="error">{error}</div>}
      </fieldset>
    );
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
      <div className="register-container">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <Field
            name="username"
            label="Username:"
            type="text"
            component={this.renderField}
          />
          <Field
            name="password"
            label="Password:"
            type="password"
            component={this.renderField}
          />
          <Field
            name="passwordConfirm"
            label="Confirm password:"
            type="password"
            component={this.renderField}
          />
          {this.renderAlert()}
          <button action="submit" className="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    user: state.auth.username
  };
}

export default reduxForm({
  form: 'loginForm',
  fields: ['username', 'password', 'passwordConfirm']
})(
  connect(mapStateToProps, actions)(RegisterForm)
);
