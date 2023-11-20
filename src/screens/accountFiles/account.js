import React, { useState, useEffect } from "react";
import { auth, signOut, updateProfile, db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./account.css";

function Account() {
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileURL, setProfileURL] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName);
      setProfileURL(auth.currentUser.photoURL);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setDisplayName(newName); // Update the local state to reflect the change
      alert("Name updated successfully");
    } catch (error) {
      console.error("Error updating name: ", error);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await auth.currentUser.updateEmail(newEmail);
      alert("Email updated successfully");
    } catch (error) {
      console.error("Error updating email: ", error);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      setProfileURL(photoURL); // Update the local state to reflect the change
      alert("Profile photo updated successfully");
    } catch (error) {
      console.error("Error updating profile photo: ", error);
    }
  };

  return (
    <div className="account-page">
      <h1 className="account-heading">Account Page</h1>

      {/* Profile Display Section */}
      <div className="profile-section">
        <img
          src={profileURL || "default-profile-placeholder.png"}
          alt="Profile"
          className="profile-photo"
        />
        <h2 className="profile-name">{displayName || "Your Name"}</h2>
        {/* Additional profile information can go here */}
      </div>

      <button onClick={handleLogOut} className="account-button">
        Log Out
      </button>

      <div className="form-section">
        <form onSubmit={handleNameChange}>
          <label className="form-label">Change Name:</label>
          <input
            className="account-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
          />
          <button type="submit" className="account-button">
            Update Name
          </button>
        </form>

        <form onSubmit={handleEmailChange}>
          <label className="form-label">Change Email:</label>
          <input
            className="account-input"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
          />
          <button type="submit" className="account-button">
            Update Email
          </button>
        </form>

        <div>
          <label className="form-label">Upload Profile Photo:</label>
          <input type="file" onChange={handleProfilePhotoChange} />
          <button onClick={handleProfilePhotoChange} className="account-button">
            Update Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
