import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import DashboardContainer from './DashboardContainer/index';
import StudentStats from './StudentStats';
import AdminLogin from './AdminLogin'

function DashboardApp(props) {
  return (
    <Router basename="/">
      <Route exact path='/dashboard' component={ DashboardContainer} />
      <Route path='/student-summary/:id' component={ StudentStats } />
      <Route path='/login' component={ AdminLogin } />
    </Router>
  );
}

export default DashboardApp;
