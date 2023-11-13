import React from 'react';
import './MatchCard.css';

const MatchCard = ({ profile, onProfileClick }) => {
  const handleProfileClick = () => {
    onProfileClick(profile); // Send the clicked profile to the parent component
  };

  return (
    <div className="match-card" onClick={handleProfileClick}>
      <div className="profile-picture">
        <div className="thumbnail-container">
          <img src={profile.profileImages[0]} alt={`${profile.name}'s Profile`} className="prof-thumbnail" />
        </div>
      </div>
      <div className="match-info">
        <h2 className='prof-details name'>{`${profile.name.split(' ')[0]} ${profile.name.split(' ')[1].charAt(0)}.`}</h2>
        <p className='prof-details age'>{profile.age} years old</p>
        <p className='prof-details major'>{profile.major}</p>
        <p className='prof-details grad'>Class of '{profile.graduationYear.substring(2)}</p>
      </div>
    </div>
  );
};

export default MatchCard;
