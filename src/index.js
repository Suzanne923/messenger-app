import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import Layout from './components/layout';
import LoginForm from './components/loginform';
import RegisterForm from './components/register-form';
import RequireAuth from './components/require_auth';
import reducers from './reducers';
// import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={App}>
          <route path="chatbox" component={RequireAuth(Layout)} />
          <Route path="login" component={LoginForm} />
          <Route path="register" component={RegisterForm} />
        </Route>
      </div>
    </Router>
  </Provider>
  , document.getElementById('root'));
