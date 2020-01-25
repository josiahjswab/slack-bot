import React from "react";
import "../../../css/style.scss";
import Logo from "../../../img/sdcs_logo.png";

function PartnerLogin(props) {
  return (
    <React.Fragment>
      <div className="flex-center">
        <div className="login-container">
          <div className="admin-logo-size">
            <div id="logo-admin-style">
              <img src={Logo} />
            </div>
          </div>
          <h1>Partner Dashboard</h1>
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
              src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
              srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
            />
          </a>
        </div>
        <p></p>
      </div>
    </React.Fragment>
  );
}

export default PartnerLogin;
