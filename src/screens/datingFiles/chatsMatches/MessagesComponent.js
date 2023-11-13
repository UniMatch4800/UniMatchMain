import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import "./MatchCard.css";
import { db, auth } from '../../../firebase';

const MessagesComponent = ({ onSelectUser }) => {
    const [chats, setChats] = useState([]);

    const handleProfileClick = (chat) => {
        onSelectUser(chat); // Send the clicked profile to the parent component
    };

    useEffect(() => {
        const fetchData = async (userId) => {
            const chatRoomsRef = collection(db, 'chatRooms');

            // Query for documents where the participants array contains the current user's ID
            const userChatRoomsQuery = query(chatRoomsRef, where('participants', 'array-contains', userId));

            try {
                const querySnapshot = await getDocs(userChatRoomsQuery);

                const otherUserIds = [];

                querySnapshot.forEach((doc) => {
                    const chatRoom = doc.data();

                    // Get the other user's ID by removing the current user from the participants array
                    const otherUserId = chatRoom.participants.filter((participantId) => participantId !== userId)[0];

                    if (otherUserId) {
                        otherUserIds.push(otherUserId);
                    }
                });

                // Fetch additional user information
                const otherUsersInfo = await fetchOtherUsersInfo(otherUserIds);
                console.log(otherUsersInfo);
                setChats(otherUsersInfo);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // User is logged in
                const userId = firebaseUser.uid;

                // Call fetchData with the userId
                await fetchData(userId);
            } else {
                // User is not logged in, handle as needed
                setChats([]); // Reset the state when the user logs out
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchOtherUsersInfo = async (otherUserIds) => {
        const otherUsersInfo = [];

        for (const userId of otherUserIds) {
            try {
                // Fetch profile image from "datingProfiles" collection using user ID
                const datingProfileQuery = query(
                    collection(db, 'datingProfiles'),
                    where('uid', '==', userId)
                );
                const datingProfileSnapshot = await getDocs(datingProfileQuery);

                if (datingProfileSnapshot.empty) {
                    console.error(`No data found for dating profile of user with ID: ${userId}`);
                    continue;
                }

                // Assume there is only one document per user ID, so directly access the first document
                const datingProfileData = datingProfileSnapshot.docs[0].data();
                const profileImages = datingProfileData.profileImages;
                const bio = datingProfileData.bio;
                const age = datingProfileData.age;
                const gender = datingProfileData.gender;
                const hobbies = datingProfileData.hobbies;
                const race = datingProfileData.race;

                // Fetch name from "users" collection
                const userRef = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userRef);

                if (!userSnapshot.exists()) {
                    console.error(`No data found for user with ID: ${userId}`);
                    continue;
                }

                const name = userSnapshot.data().name;
                const campus = userSnapshot.data().campus;
                const graduationYear = userSnapshot.data().graduationYear;
                const major = userSnapshot.data().major;


                const lastMessage = await fetchLastMessage(userId);

                // Add user information to the array
                otherUsersInfo.push({
                    uid: userId,
                    name,
                    campus,
                    graduationYear,
                    major,
                    bio,
                    hobbies,
                    age,
                    gender,
                    race,
                    profileImages,
                    lastMessage,
                });

            } catch (error) {
                console.error(`Error fetching data for user with ID: ${userId}`, error);
            }
        }

        return otherUsersInfo;
    };

    const fetchLastMessage = async (userId) => {
        const chatRoomsRef = collection(db, 'chatRooms');
        const userChatRoomsQuery = query(chatRoomsRef, where('participants', 'array-contains', userId));

        try {
            const querySnapshot = await getDocs(userChatRoomsQuery);

            const lastMessages = [];

            for (const doc of querySnapshot.docs) {
                const chatRoom = doc.data();
                const otherUserId = chatRoom.participants.filter((participantId) => participantId !== userId)[0];

                // Fetch the last message in the chat room
                const messagesRef = collection(db, 'chatRooms', doc.id, 'messages');
                const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
                const messageSnapshot = await getDocs(messagesQuery);

                if (!messageSnapshot.empty) {
                    const lastMessage = messageSnapshot.docs[0].data();
                    const sender = lastMessage.sender;

                    lastMessages.push({
                        chatRoomId: doc.id,
                        otherUserId,
                        sender,
                        text: lastMessage.text,
                        timestamp: lastMessage.timestamp.toDate(),
                    });
                }
            }

            return lastMessages;
        } catch (error) {
            console.error('Error fetching last messages:', error);
            return [];
        }
    };

    function timeAgo(date) {
        const now = new Date();
        const differenceInSeconds = (now - date) / 1000;

        if (differenceInSeconds < 60) {
            // less than a minute
            const seconds = Math.round(differenceInSeconds);
            return `${seconds === 1 ? '1 second' : `${seconds} seconds`} ago`;
        } else if (differenceInSeconds < 3600) {
            // less than an hour
            const minutes = Math.round(differenceInSeconds / 60);
            return `${minutes === 1 ? '1 minute' : `${minutes} minutes`} ago`;
        } else if (differenceInSeconds < 86400) {
            // less than a day
            const hours = Math.round(differenceInSeconds / 3600);
            return `${hours === 1 ? '1 hour' : `${hours} hours`} ago`;
        } else {
            // days or more
            const days = Math.round(differenceInSeconds / 86400);
            return `${days === 1 ? '1 day' : `${days} days`} ago`;
        }
    }

    return (
        <div className='messages-component'>
            {chats.map((chat) => (
                <div key={chat.uid}>
                    <div className='match-card' onClick={() => handleProfileClick(chat)}>
                        <div className="profile-picture">
                            <div className="thumbnail-container">
                                <img src={chat.profileImages[0]} alt="Profile" className="prof-thumbnail" />
                            </div>
                        </div>
                        <div className='match-info'>
                            <p className="time-ago time-ago-message" >{timeAgo(chat.lastMessage[0].timestamp)}</p>
                            <h3 className='prof-details name'>{`${chat.name.split(' ')[0]} ${chat.name.split(' ')[1].charAt(0)}.`}</h3>
                            <p className='prof-details last-message'>
                                {chat.lastMessage.length > 0
                                    ? chat.lastMessage[0].text.length > 40
                                        ? `${chat.lastMessage[0].text.substring(0, 40)}...`
                                        : chat.lastMessage[0].text
                                    : 'No messages yet'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessagesComponent;