import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import DashboardContainer from './DashboardContainer/index';
import StudentSummary from './StudentSummary';
import AdminLogin from './AdminLogin'

function DashboardApp(props) {
  return (
    <Router basename="/">
      <Route exact path='/dashboard' component={ DashboardContainer} />
      <Route path='/student-summary/:id' component={ StudentSummary } />
      <Route path='/login' component={ AdminLogin } />
    </Router>
  );
}

export default DashboardApp;
