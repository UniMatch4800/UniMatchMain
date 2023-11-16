import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, getDoc, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import "./swiping.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faHeart, faTimes, faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Swiping = ({ currentProfileUid, setCurrentProfileUid, filters, profilesAvailable, setProfilesAvailable }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query all profile UIDs that the user has interacted with (liked, disliked, superliked)
        const userActionsRef = doc(db, 'userActions', auth.currentUser.uid);
        const userActionsSnapshot = await getDoc(userActionsRef);
        const userActionsData = userActionsSnapshot.data() || {};
        const likes = userActionsData.likes || [];
        const dislikes = userActionsData.dislikes || [];
        const superlikes = userActionsData.superlikes || [];
        const userInteractions = [...likes, ...dislikes, ...superlikes];

        // Query all dating profiles excluding user interactions and current user's own profile
        const datingProfilesQuery = query(
          collection(db, 'datingProfiles'),
          where('uid', 'not-in', [...userInteractions, auth.currentUser.uid])
        );
        const datingProfilesSnapshot = await getDocs(datingProfilesQuery);

        if (datingProfilesSnapshot.empty) {
          // Handle the case when there are no more profiles
          console.log('All out of profiles from your school. Check back soon.');
          return;
        }

        const datingProfilesData = datingProfilesSnapshot.docs.map((doc) => doc.data());

        // Fetch user data for the remaining profiles
        const userIds = datingProfilesData.map((profile) => profile.uid);
        const usersQuery = query(collection(db, 'users'), where('uid', 'in', userIds));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.data().uid] = doc.data();
          return acc;
        }, {});

        // Combine profiles and user data
        const combinedProfiles = datingProfilesData
          .filter((profile) => profile.uid !== auth.currentUser.uid)
          .map((profile) => ({
            ...profile,
            ...usersData[profile.uid],
          }));

          const filteredProfiles = combinedProfiles.filter((profile) => {
            console.log(filters)
            if (
              profile &&
              (!filters.age || // No age filter, return all profiles
                (filters.age.value === '') || // Age filter set to 'Age'
                (filters.age === "30+" && profile.age >= 30) || // Handle "30+" case
                (filters.age !== "30+" && ageFilter(profile, filters.age)) // Handle other age ranges
              ) &&
              (!filters.campus || filters.campus.value === "" || profile.campus === filters.campus) &&
              (!filters.gender || filters.gender.value === "" || profile.gender === filters.gender.value) &&
              (!filters.graduationYear || filters.graduationYear.value === "" || profile.graduationYear === filters.graduationYear.value) &&
              (!filters.hobbies || filters.hobbies.value === "" || profile.hobbies.includes(filters.hobbies.value)) &&
              (!filters.major || filters.major.value === "" || profile.major === filters.major.value) &&
              (!filters.race || filters.race.value === "" || profile.race === filters.race.value)
            ) {
              return true;
            }
            return false;
          });

        function ageFilter(profile, ageRange) {
          if (profile && ageRange && ageRange.value) {
            if (ageRange.value === "30+") {
              return profile.age >= 30;
            } else {
              const [minAgeStr, maxAgeStr] = ageRange.value.split('-');
              const minAge = parseInt(minAgeStr);
              const maxAge = parseInt(maxAgeStr);
              return profile.age >= minAge && profile.age <= maxAge;
            }
          }
        }

        setProfiles(filteredProfiles);
        console.log(filteredProfiles);
        if (filteredProfiles.length > 0) {
          setCurrentProfileUid(filteredProfiles[0].uid);
          setProfilesAvailable(true); // Update profilesAvailable state here
        } else {
          setProfilesAvailable(false); // Update profilesAvailable state here
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [filters]);


  useEffect(() => {
    // Update currentProfileUid whenever currentIndex changes
    if (currentIndex < profiles.length) {
      setCurrentProfileUid(profiles[currentIndex].uid);
      setProfilesAvailable(true);
    } else if (currentIndex >= profiles.length) {
      setCurrentProfileUid(null);
      setProfilesAvailable(false);
    }
  }, [currentIndex, profiles, setCurrentProfileUid]);

  const createMatch = async (currentUserId, likedUserId) => {
    const currentUserIdRef = doc(db, 'userActions', currentUserId);
    const likedUserIdRef = doc(db, 'userActions', likedUserId);

    try {
      const currentDocSnapshot = await getDoc(currentUserIdRef);
      const likedDocSnapshot = await getDoc(likedUserIdRef);

      const currentData = currentDocSnapshot.exists ? currentDocSnapshot.data() : null;
      const likedData = likedDocSnapshot.exists ? likedDocSnapshot.data() : null;

      if (currentData && likedData) {
        if (currentData.likes.includes(likedUserId) && likedData.likes.includes(currentUserId)) {
          currentData.matches = currentData.matches || [];
          likedData.matches = likedData.matches || [];

          // Add the liked user to the current user's matches
          if (!currentData.matches.includes(likedUserId)) {
            currentData.matches.push(likedUserId);
          }

          // Add the current user to the liked user's matches
          if (!likedData.matches.includes(currentUserId)) {
            likedData.matches.push(currentUserId);
          }

          // Update the current user's document
          await setDoc(currentUserIdRef, currentData);

          // Update the liked user's document
          await setDoc(likedUserIdRef, likedData);
        }
      }
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      const likedProfileUid = profiles[currentIndex].uid;

      // Assuming `auth.currentUser` is available and contains the user's information
      const userActionsRef = doc(db, 'userActions', auth.currentUser.uid);

      getDoc(userActionsRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document exists, update the 'likes' array
          const userActionsData = docSnapshot.data();
          userActionsData.likes.push(likedProfileUid);

          // Update the document with the new 'likes' array
          setDoc(userActionsRef, userActionsData);
          createMatch(auth.currentUser.uid, likedProfileUid);
        } else {
          // Document doesn't exist, create a new document
          setDoc(userActionsRef, { likes: [likedProfileUid], dislikes: [], superlikes: [] });
        }
      });
    } else if (direction === 'left') {
      const dilikedProfileUid = profiles[currentIndex].uid;
      // Assuming `auth.currentUser` is available and contains the user's information
      const userActionsRef = doc(db, 'userActions', auth.currentUser.uid);

      getDoc(userActionsRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document exists, update the 'likes' array
          const userActionsData = docSnapshot.data();
          userActionsData.dislikes.push(dilikedProfileUid);

          // Update the document with the new 'likes' array
          setDoc(userActionsRef, userActionsData);
        } else {
          // Document doesn't exist, create a new document
          setDoc(userActionsRef, { likes: [], dislikes: [dilikedProfileUid], superlikes: [] });
        }
      });
    } else if (direction === 'superlike') {
      const superlikedProfileUid = profiles[currentIndex].uid;
      const userActionsRef = doc(db, 'userActions', auth.currentUser.uid);

      getDoc(userActionsRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userActionsData = docSnapshot.data();
          userActionsData.superlikes.push(superlikedProfileUid);

          setDoc(userActionsRef, userActionsData);
        } else {
          setDoc(userActionsRef, { likes: [], dislikes: [], superlikes: [superlikedProfileUid] });
        }
      });
    }
    setPrevIndex(currentIndex);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setCurrentImageIndex(0);
  };

  const handleReverse = () => {
    if (prevIndex !== null) {
      const likedProfileUid = profiles[prevIndex].uid; // Get the UID of the profile to be removed
      const userActionsRef = doc(db, 'userActions', auth.currentUser.uid);

      getDoc(userActionsRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // Document exists, update the corresponding action array
            const userActionsData = docSnapshot.data();

            userActionsData.likes = userActionsData.likes.filter(uid => uid !== likedProfileUid);
            userActionsData.dislikes = userActionsData.dislikes.filter(uid => uid !== likedProfileUid);
            userActionsData.superlikes = userActionsData.superlikes.filter(uid => uid !== likedProfileUid);

            // Update the document with the modified action arrays
            setDoc(userActionsRef, userActionsData);
          } else {
            // Document doesn't exist, which is unexpected in this case
            console.error('UserActions document not found.');
          }
        })
        .catch((error) => {
          console.error('Error handling reverse:', error);
        });

      // Set the previous index and current index
      setCurrentIndex(prevIndex);
      setPrevIndex(null);
      setCurrentProfileUid(profiles[prevIndex].uid);
      setCurrentImageIndex(0);
    }
  };

  const handleInstantMessage = () => {
    console.log("IM has been clicked");
  };

  const handleImageClick = (event) => {
    const clickX = event.nativeEvent.offsetX;
    const imageWidth = event.target.clientWidth;
    const numPics = profiles[currentIndex].profileImages.length;

    if (clickX < imageWidth / 2) {
      if (currentImageIndex !== 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
    else {
      if (currentImageIndex < numPics - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
      else {
        setCurrentImageIndex(0);
      }
    };
  };
  
  return (
    <div className='dating-pieces'>
      {profiles.length > 0 && currentIndex < profiles.length ? (
        <>
          <div className="carousel-container-swiping">
            <Carousel
              selectedItem={currentImageIndex}
              onChange={(index) => setCurrentImageIndex(index)}
              showArrows={true}
              showStatus={true}
              showThumbs={false}
              onClick={handleImageClick}
            >
              {profiles[currentIndex].profileImages.map((image, index) => (
                <div key={index} className='profile-image-box'>
                  <img src={image} alt={profiles[currentIndex].name} className="profile-image" />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="profile-info-box">
            <p className='person-name'>{profiles[currentIndex].name}, {profiles[currentIndex].age}</p>

            <p>
              <span className="info-label">Gender: </span>
              {profiles[currentIndex].gender}
            </p>
            <p>
              <span className="info-label">Race: </span>
              {profiles[currentIndex].race}
            </p>
            <p>
              <span className="info-label">Major: </span>
              {profiles[currentIndex].major}
            </p>
            <p>
              <span className="info-label">Graduation Year: </span>
              {profiles[currentIndex].graduationYear}
            </p>
            <p>
              <span className="info-label">Hobbies: </span>
              {profiles[currentIndex].hobbies}
            </p>
            <p>
              <span className="info-label">Bio: </span>
              {profiles[currentIndex].bio}
            </p>
          </div>
          <div className="button-container">
            <button onClick={handleReverse} className='reverse'>
              <FontAwesomeIcon icon={faUndo} /> {/* Reverse */}
            </button>
            <button onClick={() => handleSwipe('left')} className='dislike'>
              <FontAwesomeIcon icon={faTimes} /> {/* Dislike */}
            </button>
            <button onClick={() => handleSwipe('superlike')} className='superlike'>
              <FontAwesomeIcon icon={faStar} /> {/* Superlike */}
            </button>
            <button onClick={() => handleSwipe('right')} className='like'>
              <FontAwesomeIcon icon={faHeart} /> {/* Like */}
            </button>
            <button onClick={() => handleInstantMessage()} className='message'>
              <FontAwesomeIcon icon={faComment} /> {/* Instant Message */}
            </button>
          </div>
        </>
      ) : (
        <h3 className='none-left'>No more profiles left for your school! Check back soon.</h3>
      )}
    </div>
  );
};

export default Swiping; 