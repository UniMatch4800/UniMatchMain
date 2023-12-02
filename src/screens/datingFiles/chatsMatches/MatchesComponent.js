import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, where, query } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import MatchCard from './MatchCard';
import "./MatchCard.css"
import LoadingIndicator from "../../../images/loadingGif.gif";


const MatchesComponent = ({ onSelectUser }) => {
    const [matchedProfiles, setMatchedProfiles] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // User is logged in
                const userId = firebaseUser.uid;

                // Call fetchData with the userId
                fetchData(userId);
            } else {
                // User is not logged in, handle as needed
                console.log("User is not logged in");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = (userId) => {
        const userActionsRef = doc(db, 'userActions', userId);

        getDoc(userActionsRef)
            .then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    const matches = userData.matches;

                    // Fetch profile data for matched users
                    fetchMatchedProfiles(matches);

                    // Check if it's on mobile, and if not, select the first match by default
                    if (!isMobile && matches && matches.length > 0) {
                        const firstMatch = matches[0];
                        const selectedUserData = matchedProfiles.find((profile) => profile.uid === firstMatch);
                        onSelectUser(selectedUserData);
                    }
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    };

    const fetchMatchedProfiles = async (matches) => {
        const matchedProfilesData = [];

        if (Array.isArray(matches)) {
            for (const uid of matches) {
                const userRef = doc(db, 'users', uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    matchedProfilesData.push(userData);

                    // Fetch dating profile data and merge it into userData
                    const datingProfileQuery = query(collection(db, 'datingProfiles'), where('uid', '==', uid));
                    const datingProfileQuerySnapshot = await getDocs(datingProfileQuery);

                    datingProfileQuerySnapshot.forEach((doc) => {
                        const datingProfileData = doc.data();
                        // Merge dating profile data into userData
                        Object.assign(userData, datingProfileData);
                    });
                }
            }
        }

        // Update the state with matched profiles
        setMatchedProfiles(matchedProfilesData);
        setLoading(false);
        // Check if it's on mobile, and if not, select the first match by default
        if (!isMobile && matchedProfilesData.length > 0) {
            const firstMatch = matchedProfilesData[0];
            const selectedUserData = matchedProfilesData.find((profile) => profile.uid === firstMatch.uid);
            onSelectUser(selectedUserData);
        }
    };

    const handleProfileClick = (clickedProfile) => {
        onSelectUser(clickedProfile);
    };

    return (
        <div className="matches-component">
            {loading ? (
                <div className='loading-indicator'>
                    <img src={LoadingIndicator} alt="Loading..." className='loading-gif'/>
                </div>
            ) : (
                <>
                    {matchedProfiles.length === 0 ? (
                        <h2 className='no-lynks'>No Lynks yet. Start liking profiles to make Lynks!</h2>
                    ) : (
                        matchedProfiles.map((profile, index) => (
                            <MatchCard
                                key={index}
                                profile={profile}
                                onProfileClick={handleProfileClick}
                            />
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default MatchesComponent;
