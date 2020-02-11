import React from 'react';
import { Link } from 'react-router-dom'

function HamburgerNavigation(props) {

  return (

    <React.Fragment>
      <div className='pad1 '>
        <div className='dashboard-link'>
          <Link className='sdcs-logo' to={`/admin/dashboard?auth_token=${props.auth_token}`}>
            <div id='logo-style-student-page'></div></Link>
        </div>
        <nav id="page-nav">
          <div className='pad'></div>
          <label for="hamburger">&#9776;</label>
          <div className='right'>
          <input type="checkbox" id="hamburger" />
          <br></br>
            <ul
              className='navigation'>
              <li
                className='hamCentering2'>
                  <div
                    className='student-stats-other-buttons size-adjust'
                    onClick={props.openStudentAbsenteeInfo()}>
                    Absences
                  </div>
              </li>
              <li
                className='hamCentering2'>
                  <div
                    className='student-stats-other-buttons size-adjust'
                    onClick={props.openStudentAccountabilityPartnerInfo()}>
                    Partner
                </div>
              </li>
              <li
                className='hamCentering2'>
                  <div
                    className='student-stats-edit-student'
                    onClick={props.openStudentEditWindow()}>
                    Edit Student
				          </div>
              </li>
              <li
                className='hamCentering3'>
                <Link
                  to={`/admin/login`}
                  className='student-stats-other-buttons size-adjust-logout'
                  onClick={() => localStorage.removeItem('token')}
                >Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
}

export default HamburgerNavigation;

