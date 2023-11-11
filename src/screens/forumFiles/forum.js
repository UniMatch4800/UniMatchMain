import React, { useState, useEffect } from "react";
import SideMenu from "./sideMenu";
import "./forum.css";
import SecondaryHeader from "./SecondaryHeader";
import ForumFeed from "./forumFeed";
import RightSideSection from "./rightSideSection";
import CreatePost from "./CreatePost";
import MyPosts from "./MyPosts";

import { auth } from "../../firebase"; // Import Firebase auth

function Forum() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const handleToggleSideMenu = (isVisible) => {
    setIsSideMenuVisible(isVisible);
  };

  useEffect(() => {
    // Set up Firebase Authentication listener to get user data
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Store the user's ID
      }
    });
    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, []);

  const handleCreatePostClick = () => {
    setShowCreatePost(!showCreatePost);
    setShowMyPosts(false);
    closeSideMenu();

  };

  const closePosts = () => {
    setShowCreatePost(false);
    setShowMyPosts(false);
  };

  const handleMyPostsClick = () => {
    setShowCreatePost(false);
    setShowMyPosts(!showMyPosts);
    closeSideMenu();
  };

  const closeSideMenu = () => {
    setIsSideMenuVisible(false);
  };

  return (
    <div className={`forum ${isSideMenuVisible ? 'side-menu-visible' : ''}`}>
      <SecondaryHeader
        onCreatePostClick={handleCreatePostClick}
        onToggleSideMenu={handleToggleSideMenu}
        isSideMenuVisible={isSideMenuVisible}
      />
      <div className="forum-main-content">
        <div className="side-menu">
          <SideMenu
            setSelectedTag={setSelectedTag}
            selectedTag={selectedTag}
            closePosts={closePosts}
            closeSideMenu={closeSideMenu}
            onMyPostsClick={handleMyPostsClick}
          />        
          </div>
        <div className="forum-content">
          {showCreatePost ? (
            <CreatePost onCancel={() => setShowCreatePost(false)} />
          ) : showMyPosts ? (
            <MyPosts userId={userId} />
          ) : (
            <ForumFeed selectedTag={selectedTag} />
          )}
        </div>
        <div className="right-side-section">
          <RightSideSection />
        </div>
      </div>
    </div>
  );
}

export default Forum;