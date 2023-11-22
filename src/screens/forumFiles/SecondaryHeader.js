import React from "react";
import "./SecondaryHeader.css";
import { Link } from "react-router-dom";
import { FaPlus, FaFilter } from "react-icons/fa";

function SecondaryHeader({ onCreatePostClick, onToggleSideMenu, isSideMenuVisible }) {
  const handleToggleSideMenu = () => {
    onToggleSideMenu(!isSideMenuVisible);
  };

  return (
    <div className="secondary-header">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="mobile-menu-icon filter-icon" onClick={handleToggleSideMenu}>
        <FaFilter />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search Forums"></input>
      </div>
      <Link to="#" className="create-post-button" onClick={onCreatePostClick}>
        <FaPlus />
      </Link>{" "}
    </div>
  );
}

export default SecondaryHeader;
