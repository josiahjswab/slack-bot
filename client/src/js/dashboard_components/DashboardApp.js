import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import DashboardContainer from './DashboardContainer/index';
import StudentSummary from './StudentSummary';
import InactiveRoster from './InactiveRoster';

function DashboardApp(props) {
  return (
    <Router>
      <Route exact path='/dashboard' component={ DashboardContainer} />
      <Route path='/student-summary/:id' component={ StudentSummary } />
      <Route path='/inactive' component={ InactiveRoster } />
    </Router>
  );
}

export default DashboardApp;
