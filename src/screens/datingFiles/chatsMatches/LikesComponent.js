import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import "./LikesComponent.css";

const LikesComponent = () => {
  const [likedUserIds, setLikedUserIds] = useState([]);
  const [matchedUserIds, setMatchedUserIds] = useState([]);
  const [datingProfiles, setDatingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedUserIds = async () => {
      const likedProfilesQuery = query(collection(db, 'userActions'), where('likes', 'array-contains', auth.currentUser.uid));
      const likedProfilesSnapshot = await getDocs(likedProfilesQuery);
      const userIds = likedProfilesSnapshot.docs
        .filter(doc => doc.id !== auth.currentUser.uid)
        .map(doc => doc.id);
      setLikedUserIds(userIds);
    };

    const fetchMatchedUserIds = async () => {
      const matchedProfilesQuery = query(collection(db, 'userActions'), where('matches', 'array-contains', auth.currentUser.uid));
      const matchedProfilesSnapshot = await getDocs(matchedProfilesQuery);
      const userIds = matchedProfilesSnapshot.docs
        .filter(doc => doc.id !== auth.currentUser.uid)
        .map(doc => doc.id);
      setMatchedUserIds(userIds);
    };

    const fetchData = async () => {
      await fetchLikedUserIds();
      await fetchMatchedUserIds();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Filter out matched users from liked users
      const remainingLikedUserIds = likedUserIds.filter(userId => !matchedUserIds.includes(userId));

      // Fetch dating profiles for the remaining liked users
      const fetchDatingProfiles = async () => {
        const profilesData = [];

        for (const userId of remainingLikedUserIds) {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const datingProfileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', userId));
            const datingProfileQuerySnapshot = await getDocs(datingProfileQuery);

            datingProfileQuerySnapshot.forEach((doc) => {
              const datingProfileData = doc.data();
              // Merge dating profile data into userData
              Object.assign(userData, datingProfileData);
            });

            profilesData.push(userData);
          }
        }

        setDatingProfiles(profilesData);
      };

      fetchDatingProfiles();
    }
  }, [likedUserIds, matchedUserIds, loading]);

  return (
    <div className='likes-container'>
      {loading ? (
        <div className='loading-indicator'><ClipLoader color="#ffffff" loading={loading} size={100} /></div>
      ) : (
        <div className="profiles-container">
          {datingProfiles.map((profile, index) => (
            <div key={index} className="profile">
              <img
                src={profile.profileImages[0]} // Update with the correct field for profile image
                alt={profile.name}
                className='prof-pic'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );  
};

export default LikesComponent;
