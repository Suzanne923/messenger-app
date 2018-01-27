import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import Layout from './components/layout';
import LoginForm from './components/loginform';
import RegisterForm from './components/register-form';
import RequireAuth from './components/require_auth';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
if (token) {
  // send token to db, db checks id in token and sends back the user
  this.props.fetchUser();
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={LoginForm} />
        <Route path="login" component={LoginForm} />
        <Route path="register" component={RegisterForm} />
        <Route path="chatbox" component={RequireAuth(Layout)} />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root'));
