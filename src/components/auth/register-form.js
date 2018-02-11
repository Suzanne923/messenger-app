import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import '../../style/register-form.css';

const fileMaxSize = 1000000;
const fields = ['username', 'password', 'passwordConfirm', 'file'];

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_uri: '',
      error: ''
    }
  }

  handleFormSubmit({ file, password, passwordConfirm, username }) {
    const { registerUser } = this.props;
    if (file) {
      const fileType = file[0].type;
      const filename = file[0].name;
      const data = this.state.data_uri;
      if (file[0].size < fileMaxSize) {
        registerUser({ username, password, fileType, filename, data });
      }
    } else {
      registerUser({ username, password });
    }

  }

  renderField = ({ input, name, label, placeholder, type, meta: { touched, error } }) => {
    return (
      <fieldset className="form-group">
        { label && <label>{label}</label> }
        <input {...input} name={name} placeholder={placeholder} type={type} className="form-control" />
        {touched && error && <div className="error">{error}</div>}
      </fieldset>
    );
  }

  renderAlert = () => {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {errorMessage}
        </div>
      );
    }
  }

  customFileInput = (field) => {
    const { meta: { touched, error } } = field;
    delete field.input.value;
    return (
      <fieldset>
        <label>Upload a user image:</label>
        <input
          className="file-input"
          type="file"
          id="file"
          { ...field.input }
            onChange={
              (e) => {
                e.preventDefault();
                const file = e.target.files[0];
                if (file.size > fileMaxSize) {
                  this.setState({ error: 'image too large (max 1mb)' })
                } else {
                  this.setState({ error: '' });
                }
                const reader = new FileReader();

                reader.onload = (upload) => {
                  this.setState({
                    data_uri: upload.target.result
                  });
                };
                reader.readAsDataURL(file);
              }
            }
        />
      {touched && error && <div className="error">{error}</div>}
      {(this.state.error !== '') && <div className="error">{this.state.error}</div>}
      </fieldset>
    );
  }

  render() {
    let { handleSubmit } = this.props;

    return (
      <div className="register-container">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <Field
            name="username"
            placeholder="Username"
            type="text"
            component={this.renderField}
          />
          <Field
            name="password"
            placeholder="Password"
            type="password"
            component={this.renderField}
          />
          <Field
            name="passwordConfirm"
            placeholder="Confirm password"
            type="password"
            component={this.renderField}
          />
          <Field
            name="file"
            type="file"
            component={this.customFileInput}
          />
          {this.renderAlert()}
          <button action="submit" className="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  let errors = {}

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
