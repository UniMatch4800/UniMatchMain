import React from "react";
import { Link } from "react-router-dom";
import ULyfeLogo from "../images/ULyfelogo-PhotoRoom.png";
import "../App.css";

function Header() {
  return (
    <header>
      {/* Left Section */}
      <div className="header-left">
        {/* Add your logo here */}
        <img src={ULyfeLogo} alt="ULyfe Logo" className="logo" />
        {/* Page Options */}
        <nav>
          <ul>
            <li>
              <Link to="/screens/forum">Forum</Link>
            </li>
            <li>
              <Link to="/screens/dating">Lynk</Link>
            </li>
            <li>
              <Link to="/screens/events">Events</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Circular Account Button */}
        <Link to="/screens/account" className="account-button">My Account</Link>
      </div>
    </header>
  );
}

export default Header;
