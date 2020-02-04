import React from "react";
import "../../../css/style.scss";
import Logo from "../../../img/sdcs_logo.png";
import slackLogo from "../../../img/smallSlackLogo.png";

function StudentLogin(props) {
  return (
    <React.Fragment>
      <div className="flex-center">
        <div className="login-container">
          <div className="admin-logo-size">
            <div id="logo-admin-style">
              <img src={Logo} />
            </div>
          </div>
          <h1>Student Dashboard</h1>
        </div>
      </div>
      <div className="auth">
        <br></br>
        <br></br>
        <div className="shadow">
          <a href="/auth/slack">
            <img
              alt="Sign in with Slack"
              height="40"
              width="172"
              src={slackLogo}
            />
          </a>
        </div>
        <p></p>
      </div>
    </React.Fragment>
  );
}

export default StudentLogin;
