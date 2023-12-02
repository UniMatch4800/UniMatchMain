import React from "react";
import "./SecondaryHeader.css";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaFilter } from "react-icons/fa";

function SecondaryHeader({ onCreateEventClick, onMyEventsClick, onSideMenuClick }) {
  // Added onMyEventsClick here
  return (
    <div className="secondary-header-events">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="filter-icon" onClick={onSideMenuClick}>
        <FaFilter />
      </div>
      <div className="search-bar">
        {/* <input type="text" placeholder="Event Search Functionality Coming Soon"></input> */}
        <h2 className="page-title">Events</h2>
      </div>
      {/* <Link to="#" className="my-events-button" onClick={onMyEventsClick}>
        My Events
      </Link> */}
      <Link to="#" className="create-event-button" onClick={onCreateEventClick}>
        <FaCalendarPlus />
      </Link>
    </div>
  );
}

export default SecondaryHeader;
