import React, { useState, useEffect } from "react";
import "./ProfileInfo.css";
import { Carousel } from 'react-responsive-carousel';

const ProfileInfo = ({ selectedUser }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedUser]);

  const customArrowStyles = {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: '24px',
    background: 'none',
    border: 'none',
  };

  const customIndicatorContainerStyles = {
    position: 'absolute',
    top: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    zIndex: 10,
    background: '#111',
    padding: '2px 0',
  };

  const customIndicatorStylesSwiping = {
    backgroundColor: "#111",
    height: 4,
    width: '100%',
    margin: 0,
  };

  return (
    <>
      {!selectedUser ? (
        <div className="loading-indicator"><h2 className="no-lynks">Select a profile to see user information.</h2></div>
      ) : (
        <div className="profile-container">
          <div className="info-carousel-container">
            <div style={{ ...customIndicatorContainerStyles, top: '0' }}>
              {selectedUser.profileImages.map((_, index) => {
                const isSelected = selectedImageIndex === index;
                const backgroundColor = isSelected ? '#faa805' : '#fff';
                return (
                  <div
                    key={index}
                    style={{
                      ...customIndicatorStylesSwiping,
                      background: backgroundColor,
                    }}
                  />
                );
              })}
            </div>
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              onChange={(index) => {
                setSelectedImageIndex(index); // Set the selected image index
              }}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <button type="button" onClick={onClickHandler} title={label} style={{ ...customArrowStyles, left: 15 }}>
                    {'⟨'} {/* Left arrow */}
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <button type="button" onClick={onClickHandler} title={label} style={{ ...customArrowStyles, right: 15 }}>
                    {'⟩'} {/* Right arrow */}
                  </button>
                )
              }
              renderIndicator={() => null}
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
      )}
    </>
  );
};

export default ProfileInfo;