import React from 'react';
import { Link } from 'react-router-dom'

function HamburgerNavigation(props) {

  return (
    <React.Fragment>
      <div className='hamburger' onClick={toggleMenu}><div></div></div>
      <ul className='navigation hamburger-navigation'>
        <li>
        <Link className='link-btn2' to={`/admin/login`} 
        onClick={() => localStorage.removeItem('token')}
        >Logout
        </Link>
        </li>
        <li onClick={props.openStudentEditWindow()}>
          <div className='secondary-btn'>
            Edit Student
					</div>
        </li>
        <li className='dashboard-link'>
          <Link className='sdcs-logo' to={`/admin/dashboard?auth_token=${props.auth_token}`}>
            <p id='logo-style-student-page'></p></Link>
          <p className='dash-btn'></p>
        </li>
      </ul>
    </React.Fragment>
  );
}

function toggleMenu() {
  const nav = document.getElementsByClassName('hamburger-navigation')[0];
  if (nav.classList.contains('visible')) {
    nav.classList.remove('visible')
  } else {
    nav.classList.add('visible');
  }
}

export default HamburgerNavigation;
