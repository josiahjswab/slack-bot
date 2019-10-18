import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import DashboardApp from './dashboard_components/DashboardApp';
import store from './rootStore';
import '../css/style.scss';
render(
    <Provider store={ store }>
    <DashboardApp />
    </Provider>,
    document.getElementById('root'));