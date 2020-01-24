import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DashboardContainer from './DashboardContainer/index';
import StudentStats from './StudentStats';
import AdminLogin from './AdminLogin';
import StudentLogin from './StudentView/StudentLogin';

function DashboardApp(props) {
  return (
    <Router basename="/">
      <Route exact path='/admin/dashboard' component={ DashboardContainer} />
      <Route path='/admin/student-summary/:id' component={ StudentStats } />
      <Route path='/admin/login' component={ AdminLogin } />
      <Route path='/login' component={ StudentLogin } />
    </Router>
  );
}

export default DashboardApp;
