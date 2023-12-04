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

  const handleChangePass = () => {
    navigate("/screens/password-reset")
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const openExternalLink = () => {
    window.open("https://forms.gle/3ydfRYe1mVqn5GRJA", '_blank');
  };

  return (
    <div className="account-page">
      <h1 className="account-heading">Profile Settings</h1>
      <button className="account-button feedback-button" onClick={openExternalLink}>
        Submit Feedback
      </button>

      <button onClick={handleEditProfile} className="account-button">
        Edit Dating Profile
      </button>

      <button onClick={handleMyPosts} className="account-button">
        Your Forum Posts
      </button>

      <button onClick={handleMyEvents} className="account-button">
        Your Event Posts
      </button>

      <button onClick={handleChangePass} className="account-button">
        Change Password
      </button>

      <button onClick={handleLogOut} className="account-button">
        Log Out
      </button>
    </div>
  );
}

export default Account;
