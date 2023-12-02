import React, { useEffect, useState } from "react";
import "./rightSideSection.css";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";


function RightSideSection({ setSelectedTag }) {
  const [trendingTalks, setTrendingTalks] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the top 5 trending posts (based on vote count)
    const postsCollection = collection(db, "forumPosts");
    const postsQuery = query(
      postsCollection,
      orderBy("votesCount", "desc"),
      limit(5)
    );

    const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
      const trendingPostsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trendingPostsData.push({
          id: doc.id,
          title: data.forumTitle,
          votesCount: data.votesCount,
        });
      });
      setTrendingTalks(trendingPostsData);
    });

    // Fetch the posts to calculate trending tags
    const tagsMap = new Map();

    const tagsCollection = collection(db, "forumPosts");
    const tagsQuery = query(tagsCollection);

    const unsubscribeTags = onSnapshot(tagsQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const tags = data.tags;

        if (tags && tags.length > 0) {
          tags.forEach((tag) => {
            if (tagsMap.has(tag)) {
              tagsMap.set(tag, tagsMap.get(tag) + 1);
            } else {
              tagsMap.set(tag, 1);
            }
          });
        }
      });

      // Sort the tags by post count in descending order and limit to top 5
      const sortedTags = [...tagsMap.entries()].sort(
        (a, b) => b[1] - a[1]
      );

      setTrendingTags(
        sortedTags.slice(0, 5).map((entry) => ({
          tag: entry[0],
          count: entry[1],
        }))
      );
    });

    return () => {
      unsubscribePosts();
      unsubscribeTags();
    };
  }, []);

  function formatTag(tag) {
    // Split the tag into words based on "-"
    const words = tag.split('-');

    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words back together with spaces
    const formattedTag = capitalizedWords.join(' ');

    return formattedTag;
  }

  return (
    <div className="right-side-section-box">
      <div className="trending-talks">
        <h2>Trending Posts</h2>
        <ul>
          {trendingTalks.map((talk, index) => (
            <li key={index} className="tag-talk-link">
              <strong>
                {talk.title.length > 20 ? talk.title.slice(0, 25) + "..." : talk.title}
              </strong>
              <strong>
                {talk.votesCount} <FontAwesomeIcon icon={faHeart} className="heart-icon" />
              </strong>
            </li>
          ))}
        </ul>
      </div>
      <div className="trending-tags">
        <h2>Trending Tags</h2>
        <ul>
          {trendingTags.map((tagData, index) => (
            <li key={index} className="tag-talk-link" onClick={() => navigate(`/screens/forum?selectedTag=${tagData.tag}`)}>
              <strong>
                {formatTag(tagData.tag)}
              </strong>
              <strong>
                {tagData.count} #
              </strong>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="advertisement">
        <img src="https://www.thefashionlaw.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-24-at-1.22.33-PM.png" alt="Advertisement" />
        <p>Ad</p>
      </div> */}
    </div>
  );
}

export default RightSideSection;
