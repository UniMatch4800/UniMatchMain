import React from "react";
import "./ProfileInfo.css";
import { Carousel } from 'react-responsive-carousel';

const ProfileInfo = ({ selectedUser }) => {
  // Wait until selectedUser is available before rendering the component
  if (!selectedUser) {
    return <div className="loading-indicator"><h2 className="no-lynks">Select a profile to see user information.</h2></div>;
  }

  return (
    <div className="profile-container">
      <div className="info-carousel-container">
        <Carousel
          showArrows={true}
          showStatus={true}
          showThumbs={false}
        >
          {selectedUser.profileImages.map((image, index) => (
            <div key={index} className='info-profile-image-box'>
              <img src={image} alt={selectedUser.name} className="info-profile-image" />
            </div>
          ))}
        </Carousel>
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