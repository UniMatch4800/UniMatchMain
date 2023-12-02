import React, { useEffect, useState } from "react";
import "./forumFeed.css";
import { db } from "../../firebase";
import CommentsScreen from "./CommentsScreen";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import { increment } from "firebase/firestore";
import { auth } from "../../firebase";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useParams } from 'react-router-dom';


function ForumFeed({ selectedTag }) {
  const [forumPosts, setForumPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  selectedTag = useParams();


  useEffect(() => {
    const fetchData = () => {
      const forumPostsCollection = collection(db, "forumPosts");

      let q;
      if (selectedTag) {
        q = query(
          forumPostsCollection,
          where("tags", "array-contains", selectedTag),
          orderBy("createdAt", "desc")
        );
      } else {
        q = query(forumPostsCollection, orderBy("createdAt", "desc"));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt;
          const createdAtDate = createdAt ? createdAt.toDate() : null;

          postsData.push({
            id: doc.id,
            title: data.forumTitle,
            content: data.description,
            images: data.images,
            votes: data.votes,
            createdAt: createdAtDate,
            tags: data.tags,
          });
        });
        setForumPosts(postsData);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [selectedTag]);

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

  const vote = async (postId, change) => {
    const postRef = doc(db, "forumPosts", postId);
    const postSnapshot = await getDoc(postRef);
    const post = postSnapshot.data();

    if (post.votes && post.votes[auth.currentUser.uid]) {
      console.log("You've already voted on this post.");
      return;
    }

    await updateDoc(postRef, {
      votesCount: increment(change),
      [`votes.${auth.currentUser.uid}`]: change,
    });
  };

  const toggleCommentSection = (postId) => {
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(postId);
    }
  };

  const customArrowStyles = {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: '24px',
    background: 'rgba(0, 0, 0, 0.5)', // Black semi-transparent background
    borderRadius: '50%', // Make it circular
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    color: '#fff', // Arrow color
    lineHeight: '30px', // Center the arrow vertically
  };
  
  
  const customIndicatorContainerStyles = {
    position: 'absolute',
    top: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  };

  const customIndicatorStyles = {
    background: '#fff',
    height: 4,
    width: '100%', // Equal width
    margin: 0,
  };

  const [imageIndexes, setImageIndexes] = useState(
    forumPosts.map(() => ({ currentIndex: 0 }))
  );

  const setCurrentImageIndexForPost = (postIndex, index) => {
    setImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[postIndex] = { currentIndex: index };
      return newIndexes;
    });
  };

  return (
    <div className="forum-feed">
      {forumPosts.length === 0 ? (
        <div className="no-posts-message">
          No posts made to {selectedTag} yet.
        </div>
      ) : (
        forumPosts.map((post, postIndex) => (
          <div key={post.id} className="forum-post">
            <h2 className="post-title">{post.title}</h2>
            <span className="time-ago">{timeAgo(post.createdAt)}</span>

            {post.content && <p className="post-content">{post.content}</p>}

            {post.images && post.images.length === 1 ? (
              <div className="images-container">
                <img
                  src={post.images[0]}
                  alt={`Post 0`}
                  className="post-image"
                />
              </div>
            ) : (
              <div className="images-container" style={{ position: 'relative' }}>
                <div style={{ ...customIndicatorContainerStyles, top: '0', background: 'none' }}>
                  {post.images.map((_, index) => {
                    const isSelected = index === (imageIndexes[postIndex] ? imageIndexes[postIndex].currentIndex : 0);
                    const backgroundColor = isSelected ? '#faa805' : '#fff';
                    return (
                      <div
                        key={index}
                        style={{
                          ...customIndicatorStyles,
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
                  selectedItem={imageIndexes[postIndex] ? imageIndexes[postIndex].currentIndex : 0}
                  onChange={(index) => setCurrentImageIndexForPost(postIndex, index)}
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
                  {post.images.map((imageUrl, index) => (
                    <div key={index}>
                      <img
                        src={imageUrl}
                        alt={`Post ${index}`}
                        className="post-image"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}

            <div className="post-actions">
              <button
                className={`action-button ${post.votes && post.votes[auth.currentUser.uid] === 1
                  ? "upvoted"
                  : ""
                  }`}
                onClick={() => vote(post.id, 1)}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>

              <span>
                {post.votes
                  ? Object.values(post.votes).reduce(
                    (acc, vote) => acc + vote,
                    0
                  )
                  : 0}
              </span>

              <button
                className={`action-button ${post.votes && post.votes[auth.currentUser.uid] === -1
                  ? "downvoted"
                  : ""
                  }`}
                onClick={() => vote(post.id, -1)}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </button>

              <button
                className={`action-button ${post.votes && post.votes[auth.currentUser.uid] === -1
                  ? "downvoted"
                  : ""
                  }`}
                onClick={() => toggleCommentSection(post.id)}
              >
                <FontAwesomeIcon icon={faCommentAlt} color="#0557fa" />
              </button>
            </div>
            {selectedPostId === post.id && (
              <CommentsScreen postId={selectedPostId} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ForumFeed;