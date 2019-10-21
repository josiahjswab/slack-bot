import React from 'react';

function AdminLogin(props) {
  return(
    <React.Fragment>
    <p className='sdcs-logo' id='logo-admin-style'></p>
      <h1>Admin Dashboard</h1>
      <form action='/dashboard' method='post'>
        <input type='text' name='email' placeholder='Email' />
        <input type='password' name='password' placeholder='Password' />
        <input type='submit' value='Login' className='link-btn' />
      </form>
      <div className='auth'>
        <br></br>
        
        <br></br>
        <a href='auth/google' className='google'></a>
        
        <p>
        </p>
      </div>
    </React.Fragment>
  );
}

export default AdminLogin;
