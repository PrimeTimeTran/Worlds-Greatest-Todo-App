import React from "react";

const SignInForm = props => (
  <div className="signin-form-nav">
    <input
      value={props.email}
      className="navigation-input"
      onChange={e => {
        props.setEmail(e.target.value);
      }}
    />
    <input
      type="password"
      value={props.password}
      className="navigation-input"
      onChange={e => {
        props.setPassword(e.target.value);
      }}
    />
    <button className="Btn btn-signin" onClick={props.onSignIn}>
      Signin
    </button>
  </div>
);

export default SignInForm;
