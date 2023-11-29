import React from "react";
import { auth, signOut } from "../../firebase";
import { useNavigate } from "react-router-dom";

import "./account.css";

function Account() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/screens/myaccount");
  };

  const handleMyPosts = () => {
    // Other logic you might want to perform
    navigate("/screens/forum?showMyPosts=true");
  };
  
  const handleMyEvents = () => {
    navigate("/screens/events?showMyEvents=true")
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
      <h1 className="account-heading">Profile Settings</h1>

      <button onClick={handleEditProfile} className="account-button">
        Edit Dating Profile
      </button>

      <button onClick={handleMyPosts} className="account-button">
        Your Forum Posts
      </button>

      <button onClick={handleMyEvents} className="account-button">
        Your Event Posts
      </button>

      <button onClick={handleLogOut} className="account-button">
        Log Out
      </button>
    </div>
  );
}

export default Account;
