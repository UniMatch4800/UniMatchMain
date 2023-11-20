import React, { useState, useEffect } from "react";
import { auth, signOut, updateProfile, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./account.css";

function Account() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/myaccount");
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="account-page">
      <h1 className="account-heading">Account Page</h1>

      <div className="profile-section">
        {/* Display user profile information here */}
      </div>

      <button onClick={handleEditProfile} className="account-button">
        Edit Profile
      </button>

      <button onClick={handleLogOut} className="account-button">
        Log Out
      </button>
    </div>
  );
}

export default Account;
