import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-card">
        {/* Admin login link */}
        <p className="eyebrow">
          <span
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/admin/login")}>
            Welcome
          </span>
        </p>
        <h1 className="landing-title">
          All your library work in one calm place.
        </h1>
        <p className="landing-text">
          Keep collections tidy, help members faster, and see what's happening
          at a glance. No clutter, just the tools you need.
        </p>

        {/* User login/signup */}
        <button className="get-started-btn" onClick={() => navigate("/login")}>
          Get Started
          <FaArrowRight className="btn-icon" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
