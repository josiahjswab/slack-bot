import React from "react";
import "../../css/style.scss";
import Logo from '../../img/sdcs_logo.png'

function AdminLogin(props) {
  return (
    <React.Fragment>
      <div className="flex-center">
        <div className="login-container">
          <div className='admin-logo-size'>
          <div id="logo-admin-style">
            <img src={Logo} />
          </div>
          </div>
          <h1>Admin Dashboard</h1>
          <form action="/admin/dashboard" method="post">
            <input type="text" className="action-email" name="email" placeholder="Email" />
            <input type="password" className="action-password" name="password" placeholder="Password" />
            <input type="submit" value="Login" className="link-btn" />
          </form>
        </div>
      </div>
      <div className="auth">
        <br></br>
        <br></br>
        <div className='shadow'>
        <a href="auth/google"><button className="loginBtn loginBtn--google">
  Login with Google</button>
</a>
</div>
        <p></p>
      </div>
    </React.Fragment>
  );
}

export default AdminLogin;
