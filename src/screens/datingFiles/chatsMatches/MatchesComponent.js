import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, where, query } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import MatchCard from './MatchCard';

const MatchesComponent = () => {
    const [matches, setMatches] = useState([]);
    const [matchedProfiles, setMatchedProfiles] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // User is logged in
                const userId = firebaseUser.uid;
                setCurrentUserUid(userId);

                // Call fetchData with the userId
                fetchData(userId);
            } else {
                // User is not logged in, handle as needed
                setCurrentUserUid(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = (userId) => {
        const userActionsRef = doc(db, 'userActions', userId);

        getDoc(userActionsRef)
            .then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    const matches = userData.matches;
                    console.log('Matches:', matches);

                    // Update the state with matches
                    setMatches(matches);

                    // Fetch profile data for matched users
                    fetchMatchedProfiles(matches);
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

        for (const uid of matches) {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
                matchedProfilesData.push(userData);
                console.log(userData);
    
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
        // Update the state with matched profiles
        setMatchedProfiles(matchedProfilesData);
    };

    return (
        <div className="matches-component">
            {matchedProfiles.map((profile, index) => (
                <MatchCard key={index} profile={profile} />
            ))}
        </div>
    );
};

export default MatchesComponent;