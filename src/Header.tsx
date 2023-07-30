import React, { useState, useCallback } from "react";
import okp4Logo from "./assets/okp4-logo.png";
import Profile from "./Profile";

export default function Header({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [profileState, setProfileState] = useState<"idle" | "hovered" | "clicked">("idle");
  const [showProfile, setShowProfile] = useState(false);

  // Handle toggling the profile menu on mouseover & click
  const handleClick = useCallback(() => {
    setProfileState("clicked");
    setShowProfile(!showProfile);
  }, [showProfile]);
  const handleMouseOver = useCallback(() => {
    if (profileState !== "clicked") {
      setProfileState("hovered");
      setShowProfile(true);
    }
  }, [profileState]);
  const handleMouseOut = useCallback(() => {
    if (profileState === "clicked") {
      setProfileState("idle");
    }
  }, [profileState]);
  const handleClose = useCallback(() => {
    if (showProfile) setShowProfile(false);
  }, [showProfile]);

  return (
    <header className="navbar-fixed">
      <nav className="navbar shadow-1 primary">
        <a href="https://okp4.network/" className="navbar-logo hide-xs">
          <img src={okp4Logo} className="logo" alt="OKP4 logo" />
        </a>
        <a href="#" className="navbar-brand hide-sm-down">
          OKP4 builder interface by MadeInTracker
        </a>
        <a href="https://www.madeintracker.com/" className="navbar-logo hide-xs-down">
          <img src="/img/logo.png" className="logo" alt="MadeInTracker logo" />
        </a>

        <div className="navbar-menu ml-auto text-grey text-light-3 font-w600 hover-text-dark">
          <a
            className={`p-2 navbar-link ${activeTab === "law_stones" && "active"}`}
            onClick={() => setActiveTab("law_stones")}
          >
            Law Stones
          </a>
          <a
            className={`p-2 navbar-link ${activeTab === "cognitarium" && "active"}`}
            onClick={() => setActiveTab("cognitarium")}
          >
            Cognitarium
          </a>
          <div
            className="dropdown dropdown-vp"
            id="profile-dropdown"
            data-ax="dropdown"
            data-dropdown-prevent-viewport="true"
          >
            <a
              href="#"
              className={`p-2 navbar-link ${showProfile ? "active" : undefined}`}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              data-target="profile-dropdown"
            >
              Profile
            </a>
            {showProfile && <Profile closeProfile={handleClose} />}
          </div>
        </div>
      </nav>
    </header>
  );
}
