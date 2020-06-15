import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app';
import './scss/shared.scss';
import './scss/modal.scss';
import './scss/tabmanager.scss';
import './scss/projectdetail.scss';
import './scss/login.scss';

const store = new Store({
  portName: 'Tabs Comminication',
});

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('main'),
  );
});
