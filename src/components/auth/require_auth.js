import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default function (ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = { router: PropTypes.object }

    componentWillMount() {
      const { authenticated } = this.props;
      const { router } = this.context;

      if (!authenticated) {
        router.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      const { router } = this.context;

      if (!nextProps.authenticated) {
        router.push('/login');
      }
    }

    render() {
      const { authenticated } = this.props;

      return (
        <div>
          { authenticated ? <ComposedComponent {...this.props} /> : <div>Loading...</div> }
        </div>
      );
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps, null)(Authentication);
}
