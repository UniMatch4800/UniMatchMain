import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // FaTimes is the close icon
import ULyfeLogo from "../images/ULyfelogo-PhotoRoom.png";
import "../App.css";
function Header() {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <header>
      <div className="header-left">
        <Link to="/screens/forum">
          <img src={ULyfeLogo} alt="ULyfe Logo" className="logo" />
        </Link>
      </div>

      <nav className="desktop-menu">
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
          <li>
            <Link to="/screens/account">Account</Link>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        {/* Mobile menu icon */}
        <div className="mobile-icon" onClick={toggleMobileMenu}>
          {mobileMenuVisible ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuVisible && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
          <ul>
            <li>
              <Link to="/screens/forum" onClick={toggleMobileMenu}>
                Forum
              </Link>
            </li>
            <li>
              <Link to="/screens/dating" onClick={toggleMobileMenu}>
                Lynk
              </Link>
            </li>
            <li>
              <Link to="/screens/events" onClick={toggleMobileMenu}>
                Events
              </Link>
            </li>
            <li>
              <Link to="/screens/account" onClick={toggleMobileMenu}>
                Account
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
