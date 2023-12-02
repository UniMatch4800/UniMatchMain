import React, { useState, useEffect } from 'react';
import "./MyAccount.css";
import { auth, db } from "../../firebase";
import { getDocs, collection, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from "../../images/loadingGif.gif";

const MyAccount = () => {
  const [datingProfileData, setDatingProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [deleteErrorPopup, setDeleteErrorPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;

        // Reference to the user's dating profile in Firestore
        const profileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', uid));

        try {
          const profileSnapshot = await getDocs(profileQuery);
          if (!profileSnapshot.empty) {
            const profileData = profileSnapshot.docs[0].data();
            setDatingProfileData(profileData);
          } else {
            console.log("No profile data found for the current user.");
          }

          // Reference to the user's document in the 'users' collection
          const userDocRef = doc(db, 'users', uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
          } else {
            console.log("No user document found for the current user.");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error.message);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const generateEmptyImageBoxes = () => {
    const emptyBoxes = [];
    const profileImagesLength = datingProfileData && datingProfileData.profileImages ? datingProfileData.profileImages.length : 0;

    for (let i = 0; i < 6 - profileImagesLength; i++) {
      emptyBoxes.push(
        <div key={`empty-box-${i}`} className="image-box empty-box">
          {/* Placeholder or leave it empty */}
          <div className="add-button" onClick={() => handleAddImageClick()}>
            <FaPlus />
          </div>
        </div>
      );
    }
    return emptyBoxes;
  };

  const handleAddImageClick = async () => {
    try {
      // Open a file input or use any other method to get the selected image
      const imageInput = document.createElement('input');
      imageInput.type = 'file';
      imageInput.accept = 'image/*';
      imageInput.click();

      imageInput.addEventListener('change', async (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
          try {
            // Upload the selected image to storage
            const storageRef = ref(storage, `datingProfileImages/${selectedImage.name}`);
            await uploadBytes(storageRef, selectedImage);

            // Get the download URL for the uploaded image
            const imageURL = await getDownloadURL(storageRef);

            // Update the dating profile data in Firestore
            const uid = auth.currentUser.uid;
            const datingProfileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', uid));
            const datingProfileSnapshot = await getDocs(datingProfileQuery);

            if (!datingProfileSnapshot.empty) {
              const datingProfileDoc = datingProfileSnapshot.docs[0];
              const datingProfileRef = doc(db, 'datingProfiles', datingProfileDoc.id);

              // Update the dating profile document
              await updateDoc(datingProfileRef, {
                profileImages: [...datingProfileData.profileImages, imageURL],
              });

              // Update the state to reflect the changes
              setDatingProfileData((prevData) => ({
                ...prevData,
                profileImages: [...prevData.profileImages, imageURL],
              }));
            } else {
              console.log('No dating profile document found for the current user.');
            }
          } catch (error) {
            console.error('Error uploading image:', error.message);
            // Handle the error as needed
          }
        }
      });
    } catch (error) {
      console.error('Error handling image click:', error.message);
      // Handle the error as needed
    }
  };

  const handleImageDelete = async () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...datingProfileData.profileImages];
      updatedImages.splice(selectedImageIndex, 1);

      if (updatedImages.length < 3) {
        // Show a popup indicating that the profile must have at least 3 photos
        // and prevent deletion
        setSelectedImageIndex(null);
        setDeleteErrorPopup(true); // Add a state variable to control this popup
      } else {
        // Proceed with deletion and update Firebase
        try {
          const uid = auth.currentUser.uid;

          // Update the datingProfiles collection in Firebase
          const datingProfileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', uid));
          const datingProfileSnapshot = await getDocs(datingProfileQuery);

          if (!datingProfileSnapshot.empty) {
            const datingProfileDoc = datingProfileSnapshot.docs[0];
            const datingProfileRef = doc(db, 'datingProfiles', datingProfileDoc.id);

            // Update the dating profile document
            await updateDoc(datingProfileRef, { profileImages: updatedImages });
          }

          // Update the state to reflect the changes
          setDatingProfileData((prevData) => ({
            ...prevData,
            profileImages: updatedImages,
          }));

          // Reset selected image index
          setSelectedImageIndex(null);
        } catch (error) {
          console.error('Error updating profile data:', error.message);
        }
      }
    }
  };

  const handleFieldEdit = (fieldName) => {
    setEditableFields((prevFields) => ({ ...prevFields, [fieldName]: true }));
  };

  const handleDatingFieldChange = (fieldName, value) => {
    setDatingProfileData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleUserFieldChange = (fieldName, value) => {
    setUserData((prevData) => ({ ...prevData, [fieldName]: value })); 
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);

    try {
      const uid = auth.currentUser.uid;

      // Update the datingProfiles collection
      const datingProfileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', uid));
      const datingProfileSnapshot = await getDocs(datingProfileQuery);

      if (!datingProfileSnapshot.empty) {
        const datingProfileDoc = datingProfileSnapshot.docs[0];
        const datingProfileRef = doc(db, 'datingProfiles', datingProfileDoc.id);

        // Update the dating profile document
        await updateDoc(datingProfileRef, datingProfileData);
        console.log('Profile data updated successfully.');
      } else {
        console.log('No dating profile document found for the current user.');
      }

      // Update the users collection
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, userData);

      console.log('User data updated successfully.');

      // Reset editableFields state to hide edit boxes
      setEditableFields({});

      // Set a timeout to stop the loading indicator after 2 seconds (adjust as needed)
      setTimeout(() => {
        setSaveLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating profile data:', error.message);

      // Ensure saveLoading is set to false in case of an error
      setSaveLoading(false);
    }
  };

  return (
    <div className='my-account-page'>
      {(datingProfileData && userData) ? (
        <>
          <div className='profile-pics'>
            <div className="image-grid">
              {datingProfileData.profileImages &&
                datingProfileData.profileImages.map((image, index) => (
                  <div key={index} className="image-box">
                    <img src={image} alt={`Profile ${index + 1}`} />
                    <div className="delete-button" onClick={() => setSelectedImageIndex(index)}>
                      <div className="x-button">
                        <FontAwesomeIcon icon={faCircle} style={{ color: "#ff0000" }} />
                        <FontAwesomeIcon icon={faTimes} style={{ color: "#ffffff", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -45%)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              {generateEmptyImageBoxes()}
            </div>
          </div>

          {(selectedImageIndex !== null && !deleteErrorPopup) && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={() => setSelectedImageIndex(null)} className='close-popup'>X</button>
                <p className='popup-text'>Are you sure you want to delete this image?</p>
                <button onClick={handleImageDelete} className='popup-btn'>Yes</button>
                <button onClick={() => setSelectedImageIndex(null)} className='popup-btn'>No</button>
              </div>
            </div>
          )}

          {deleteErrorPopup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={() => setDeleteErrorPopup(false)} className='close-popup'>X</button>
                <p className='popup-text'>The profile must have at least 3 photos. Unable to delete this image.</p>
              </div>
            </div>
          )}

          {!saveLoading ? (
            <div className='profile-fields'>
              <div className="profile-field" onClick={() => handleFieldEdit('name')}>
                <span>
                  <label className='field-label'>Name: </label>
                  {editableFields.name ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleUserFieldChange('name', e.target.value)}
                    />
                  ) : (
                    <span>{userData.name}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('major')}>
                <span>
                  <label className='field-label'>Major: </label>
                  {editableFields.major ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={userData.major}
                      onChange={(e) => handleUserFieldChange('major', e.target.value)}
                    />
                  ) : (
                    <span>{userData.major}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('graduationYear')}>
                <span>
                  <label className='field-label'>Graduation Year: </label>
                  {editableFields.graduationYear ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={userData.graduationYear}
                      onChange={(e) => handleUserFieldChange('graduationYear', e.target.value)}
                    />
                  ) : (
                    <span>{userData.graduationYear}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('campus')}>
                <span>
                  <label className='field-label'>Campus: </label>
                  {editableFields.campus ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={userData.campus}
                      onChange={(e) => handleUserFieldChange('campus', e.target.value)}
                    />
                  ) : (
                    <span>{userData.campus}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('age')}>
                <span>
                  <label className='field-label'>Age: </label>
                  {editableFields.age ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={datingProfileData.age}
                      onChange={(e) => handleDatingFieldChange('age', e.target.value)}
                    />
                  ) : (
                    <span>{datingProfileData.age}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('bio')}>
                <span>
                  <label className='field-label'>Bio: </label>
                  {editableFields.bio ? (
                    <textarea
                      className='editing-input'
                      value={datingProfileData.bio}
                      onChange={(e) => handleDatingFieldChange('bio', e.target.value)}
                    />
                  ) : (
                    <span>{datingProfileData.bio}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('gender')}>
                <span>
                  <label className='field-label'>Gender: </label>
                  {editableFields.gender ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={datingProfileData.gender}
                      onChange={(e) => handleDatingFieldChange('gender', e.target.value)}
                    />
                  ) : (
                    <span>{datingProfileData.gender}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('hobbies')}>
                <span>
                  <label className='field-label'>Hobbies: </label>
                  {editableFields.hobbies ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={datingProfileData.hobbies}
                      onChange={(e) => handleDatingFieldChange('hobbies', e.target.value)}
                    />
                  ) : (
                    <span>{datingProfileData.hobbies}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <div className="profile-field" onClick={() => handleFieldEdit('race')}>
                <span>
                  <label className='field-label'>Race: </label>
                  {editableFields.race ? (
                    <input
                      className='editing-input'
                      type="text"
                      value={datingProfileData.race}
                      onChange={(e) => handleDatingFieldChange('race', e.target.value)}
                    />
                  ) : (
                    <span>{datingProfileData.race}</span>
                  )}
                </span>
                <span><FaPencilAlt /></span>
              </div>

              <button onClick={handleSaveChanges} className='save-btn'>Save Changes</button>
            </div>
          ) : (
            <div className='loading-indicator'>
            <img src={LoadingIndicator} alt="Loading..." className='loading-gif' />
          </div>          )}
        </>
      ) : (
        <div className='loading-indicator'>
          <img src={LoadingIndicator} alt="Loading..." className='loading-gif' />
        </div>      )}
    </div>
  );
};

export default MyAccount;
