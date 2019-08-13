import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import DashboardContainer from './DashboardContainer';
import Standups from './Standups';

function DashboardApp(props) {
  return (
    <Router>
      <Route exact path='/admin' component={DashboardContainer} />
      <Route path='/standup/:id' component={Standups} />
    </Router>
  );
}

export default DashboardApp;
