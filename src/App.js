import React, { createContext } from "react";
import Account from "./screens/accountFiles/account";
import Events from "./screens/eventsFiles/events";
import Auth from "./components/auth";
import Forum from "./screens/forumFiles/forum";
import Header from "./components/header";
import AdditionalInfo from "./components/additional-info";
import PasswordReset from "./components/passwordReset";
import AuthGuard from "./AuthGuard";
import LandingPage from "./screens/LandingPage/LandingPage";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, useLocation } from "react-router-dom";

import MyAccount from "./screens/accountFiles/MyAccount";

// Create a context to share the user state across components
export const UserContext = createContext(null);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth isItLogin={true} />} />
        <Route path="/signup" element={<Auth isItLogin={false} />} />
        <Route path="screens/*" element={<ScreensRoutes />} />
      </Routes>
    </Router>
  );
}

function ScreensRoutes() {
  const location = useLocation();

  // Conditionally render Header: Don't render it if path is '/screens/additional-info'
  const shouldShowHeader = location.pathname !== "/screens/additional-info";

  return (
    <div>
      {shouldShowHeader && <Header />}{" "}
      <AuthGuard>
        <Routes>
          <Route index element={<Forum />} />
          <Route path="account" element={<Account />} />
          <Route path="forum" element={<Forum />} />
          <Route path="events" element={<Events />} />
          <Route path="additional-info" element={<AdditionalInfo />} />
          <Route path="myaccount" element={<MyAccount />} />
          <Route path="password-reset" element={<PasswordReset />} />
        </Routes>
      </AuthGuard>
    </div>
  );
}
export default App;
