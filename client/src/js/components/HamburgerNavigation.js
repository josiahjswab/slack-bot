import React from 'react';
import { Link } from 'react-router-dom'

function HamburgerNavigation(props) {

  return (
    <React.Fragment>
      <ul className='navigation'>
        <li>
          <Link className='link-btn2' to={`/admin/login`}
            onClick={() => localStorage.removeItem('token')}
          >Logout
        </Link>
        </li>
        <li>
          <div className='secondary-btn' onClick={props.openStudentEditWindow()}>
            Edit Student
					</div>
        </li>
        <li>
          <div className='secondary-btn acc-partner-btn' onClick={props.openStudentAccountabilityPartnerInfo()}>
            Accountability Partner
					</div>
        </li>
        <li className='dashboard-link'>
         <Link className='sdcs-logo' to={`/admin/dashboard?auth_token=${props.auth_token}`}>
            <div id='logo-style-student-page'></div></Link>
          <p className='dash-btn'></p>
        </li>
      </ul>
    </React.Fragment>
  );
}

export default HamburgerNavigation;
