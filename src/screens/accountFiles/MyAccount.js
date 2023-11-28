import React, { useState, useEffect } from "react";
import { auth, updateProfile, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

function MyAccount() {
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileURL, setProfileURL] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [datingProfile, setDatingProfile] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
      const userRef = db.collection("users").doc(userUid);

      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setDisplayName(userData.displayName);
            setProfileURL(userData.photoURL);

            // Fetch and set dating profile data (assuming you have a 'datingProfile' field in your user document)
            const datingProfileRef = db
              .collection("datingProfiles")
              .doc(userUid);

            datingProfileRef
              .get()
              .then((datingProfileDoc) => {
                if (datingProfileDoc.exists) {
                  const datingProfileData = datingProfileDoc.data();
                  setDatingProfile(datingProfileData);
                } else {
                  console.log("No dating profile found for the user.");
                }
              })
              .catch((error) => {
                console.log("Error fetching dating profile data: ", error);
              });
          } else {
            console.log("No such user document!");
          }
        })
        .catch((error) => {
          console.log("Error fetching user data: ", error);
        });
    }
  }, []);

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setDisplayName(newName);
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
      setProfileURL(photoURL);
      alert("Profile photo updated successfully");
    } catch (error) {
      console.error("Error updating profile photo: ", error);
    }
  };

  return (
    <div className="my-account-page">
      <div className="profile-section">
        <div className="profile-info-box">
          <div className="profile-photo-box">
            <img
              src={profileURL || "default-profile-placeholder.png"}
              alt="Profile"
              className="profile-photo"
            />
          </div>
          <h2 className="profile-name">{displayName || "Your Name"}</h2>
        </div>
      </div>

      <div className="form-section">
        <h1 className="my-account-heading">Edit Profile</h1>
        <div className="update-form-box">
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

          {datingProfile && (
            <div className="dating-profile">
              <h2>Dating Profile</h2>
              <p>Age: {datingProfile.age}</p>
              <p>Gender: {datingProfile.gender}</p>
              {/* Display other dating profile fields */}
            </div>
          )}

          <div>
            <label className="form-label">Upload Profile Photo:</label>
            <input type="file" onChange={handleProfilePhotoChange} />
            <button
              onClick={handleProfilePhotoChange}
              className="account-button"
            >
              Update Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
