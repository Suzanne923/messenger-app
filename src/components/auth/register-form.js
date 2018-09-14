import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import * as actions from '../../actions';
import FormField from './form-field';
import '../../style/register-form.css';

const fileMaxSize = 1000000;
const fields = ['username', 'password', 'passwordConfirm', 'file'];

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUri: '',
      errorMessage: ''
    };
  }

  customFileInput = (field) => {
    const fieldData = field;
    const { errorMessage } = this.state;
    const { meta: { touched, error } } = fieldData;
    delete fieldData.input.value;
    return (
      <div>
        {/* eslint-disable-next-line */}
        <label>Upload a user image:</label>
        <input
          className="file-input"
          type="file"
          id="file"
          {...fieldData.input}
          onChange={(e) => {
            e.preventDefault();
            const file = e.target.files[0];

            if (file.size > fileMaxSize) {
              this.setState({ errorMessage: 'image too large (max 1mb)' });
            } else {
              this.setState({ errorMessage: '' });
            }

            const reader = new FileReader();
            reader.onload = (upload) => {
              this.setState({ dataUri: upload.target.result });
            };
            reader.readAsDataURL(file);
          }}
        />
        {touched && error && <div className="error">{error}</div>}
        {(errorMessage !== '') && <div className="error">{errorMessage}</div>}
      </div>
    );
  }

  handleFormSubmit({
    file,
    password,
    username
  }) {
    const { registerUser } = this.props;
    if (file) {
      const fileType = file[0].type;
      const filename = file[0].name;
      const { dataUri } = this.state;
      if (file[0].size < fileMaxSize) {
        registerUser({
          username,
          password,
          fileType,
          filename,
          dataUri
        });
      }
    } else {
      registerUser({ username, password });
    }
  }

  renderField = ({
    input,
    name,
    label,
    placeholder,
    type,
    meta: { touched, error }
  }) => (
    <div>
      {/* eslint-disable-next-line */}
      { label && <label>{label}</label> }
      <input {...input} name={name} placeholder={placeholder} type={type} className="form-control" />
      {touched && error && <div className="error">{error}</div>}
    </div>
  );

  renderAlert = () => {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong>
          {errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="register-container">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <FormField
            name="username"
            placeholder="Username"
            type="text"
            component={this.renderField}
          />
          <FormField
            name="password"
            placeholder="Password"
            type="password"
            component={this.renderField}
          />
          <FormField
            name="passwordConfirm"
            placeholder="Confirm password"
            type="password"
            component={this.renderField}
          />
          <FormField
            name="file"
            type="file"
            component={this.customFileInput}
          />
          {this.renderAlert()}
          <button type="submit" action="submit" className="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.username) {
    errors.username = "enter a username";
  } else if (!values.password) {
    errors.password = "enter a password";
  } else if (!values.passwordConfirm) {
    errors.passwordConfirm = "confirm your password";
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    user: state.auth.username
  };
}

export default reduxForm({
  form: 'registerForm',
  fields,
  validate
})(
  connect(mapStateToProps, actions)(RegisterForm)
);
