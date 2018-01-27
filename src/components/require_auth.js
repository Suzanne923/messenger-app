import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default function (ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

    componentWillMount() {
      if (!this.props.authenticated) {
        console.log('redirecting unauthenticated user...')
        this.context.router.push('#/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        console.log('redirecting unauthenticated user...')
        this.context.router.push('#/login');
      }
    }

    render() {
      console.log('user authenticated')
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
