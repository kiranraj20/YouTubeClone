import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './Reducers';
import ErrorBoundary from './ErrorBoundary';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SocketProvider } from './Context/SocketProvider';

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='731770471215-ub668l1kkkrlv666vnn5qgobha3jmtad.apps.googleusercontent.com' >
    <ErrorBoundary>
      <Provider store={store}>
        <React.StrictMode>
          <SocketProvider>
            <App />
          </SocketProvider>
        </React.StrictMode>
      </Provider>
    </ErrorBoundary>
  </GoogleOAuthProvider>
);
