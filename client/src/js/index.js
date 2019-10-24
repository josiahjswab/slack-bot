import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import DashboardApp from './components/DashboardApp';
import store from './rootStore';

render(
    <Provider store={ store }>
      <DashboardApp />
    </Provider>,
    document.getElementById('root'));
