import React, { useState } from "react";

import { FaSignOutAlt } from "react-icons/fa";

import SignInForm from "./SignInForm";

const Navbar = ({ onSignIn, onSignOut, currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="Navbar">
      {currentUser.uid !== "" ? (
        <button className="Btn Btn-Signout" onClick={onSignOut}>
          <FaSignOutAlt style={{ marginRight: 10 }} />
          Sign Out
        </button>
      ) : (
        <SignInForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSignIn={() => onSignIn(email, password)}
        />
      )}
    </div>
  );
};

export default Navbar;
