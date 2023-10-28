import React, { useState } from "react";
import "./ProfileInfo.css";

const ProfileInfo = ({ selectedUser, currentImageIndex, setCurrentImageIndex }) => {
  const handleImageClick = (event) => {
    const clickX = event.nativeEvent.offsetX;
    const imageWidth = event.target.clientWidth;

    let numPics = 0;
    if (selectedUser && selectedUser.profileImages) {
      numPics = selectedUser.profileImages.length;
    }

    if (clickX < imageWidth / 2) {
      if (currentImageIndex !== 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    } else {
      if (currentImageIndex < numPics - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        setCurrentImageIndex(0);
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="picture-box">
        <img
          src={
            selectedUser && selectedUser.profileImages
              ? selectedUser.profileImages[currentImageIndex]
              : ''
          }
          alt="Profile Picture"
          className="profile-pic"
          onClick={handleImageClick}
        />
      </div>
      <div className="profile-info">
        <h2 className="name">
          {selectedUser ? selectedUser.name : 'No User Selected'}
        </h2>
        
        <div className="basic-info">
          <p className="age">
            {selectedUser && selectedUser.age
              ? `${selectedUser.age}`
              : ''}
          </p>
          <p className="race">
            {selectedUser ? selectedUser.race : ''}
          </p>
          <p className="gender">
            {selectedUser ? selectedUser.gender : ''}
          </p>
          <p className="campus">
            {selectedUser ? selectedUser.campus : ''} {selectedUser && selectedUser.graduationYear
              ? ` '${selectedUser.graduationYear.substring(2)}`
              : ''}
          </p>
        </div>

        <p className="major">
          {selectedUser ? selectedUser.major : ''}
        </p>
        <p className="hobbies">
          {selectedUser ? selectedUser.hobbies : ''}
        </p>
        <p className="bio">
          {selectedUser ? selectedUser.bio : ''}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;