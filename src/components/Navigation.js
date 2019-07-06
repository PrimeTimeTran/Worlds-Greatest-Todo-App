import React from "react";

import { FaSignOutAlt } from 'react-icons/fa';

import SignInForm from "./SignInForm";

const Navigation = ({
  email,
  password,
  onSignIn,
  setEmail,
  onSignOut,
  setPassword,
  currentUser,
}) => {
  return (
    <div className="Navigation">
      {currentUser.uid !== "" ? (
        <button className="Btn Btn-Signout" onClick={onSignOut}>
          <FaSignOutAlt style={{ marginRight: 10 }} />
          Sign Out
        </button>
      ) : (
        <SignInForm
          email={email}
          password={password}
          onSignIn={onSignIn}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
    </div>
  )
}

export default Navigation