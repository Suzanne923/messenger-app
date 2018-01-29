import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import Layout from './components/layout';
import LoginForm from './components/auth/login-form';
import RegisterForm from './components/auth/register-form';
import RequireAuth from './components/auth/require_auth';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={RequireAuth(Layout)} />
      </Route>
      <Route path="register" component={RegisterForm} />
      <Route path="login" component={LoginForm} />
    </Router>
  </Provider>
  , document.getElementById('root'));
