import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import Footer from '../footer';
import * as actions from '../../actions';
import '../../style/login-form.css';

class LoginForm extends Component {
  handleFormSubmit({ username, password }) {
    const { loginUser } = this.props;
    loginUser({ username, password });
  }

  renderAlert() {
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
      <div className="login-container">
        <div className="login">
          <h4 className="login-title">Login to start chatting!</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group">
              <Field
                name="username"
                placeholder="Username"
                component="input"
                type="text"
                className="form-control"
              />
            </fieldset>
            <fieldset className="form-group">
              <Field
                name="password"
                placeholder="Password"
                component="input"
                type="password"
                className="form-control"
              />
            </fieldset>
            {this.renderAlert()}
            <button type="submit" action="submit" className="btn btn-success login-button">Login</button>
          </form>
          <Link to="/register" className="register-link">Create an Account</Link>
        </div>
        <Footer />
      </div>
    );
  }
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired
};

LoginForm.defaultProps = { errorMessage: '' };

const mapStateToProps = state => ({ errorMessage: state.auth.error });

export default reduxForm({
  form: 'loginForm',
  fields: ['username', 'password']
})(
  connect(mapStateToProps, actions)(LoginForm)
);
