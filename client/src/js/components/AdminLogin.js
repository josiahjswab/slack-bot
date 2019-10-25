import React from "react";
import "../../css/style.scss";

function AdminLogin(props) {
  return (
    <React.Fragment>
      <div class="flex-center">
        <div class="login-container">
          <div className='admin-logo-size'>
          <div id="logo-admin-style"></div>
          </div>
          <h1>Admin Dashboard</h1>
          <form action="/dashboard" method="post">
            <input type="text" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <input type="submit" value="Login" className="link-btn" />
          </form>
        </div>
      </div>
      <div className="auth">
        <br></br>
        <br></br>
        <a href="auth/google" className="google"></a>
        <p></p>
      </div>
    </React.Fragment>
  );
}

export default AdminLogin;
