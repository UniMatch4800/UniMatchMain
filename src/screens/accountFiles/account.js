import React from "react";
import { auth, signOut } from "../../firebase"; // Ensure these are exported from your firebase.js
import { useNavigate } from "react-router-dom";
import "./account.css";
function Account() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <h1>Account Page</h1>
      <p>Welcome to your account page.</p>
      <button onClick={handleLogOut} className="account-button">
        Log Out
      </button>
    </div>
  );
}

export default Account;
