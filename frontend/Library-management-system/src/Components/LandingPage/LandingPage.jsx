import React from 'react';
import './LandingPage.css';
import { FaArrowRight } from 'react-icons/fa';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="landing-page">
            <div className="landing-card">
                <p className="eyebrow">Welcome</p>
                <h1 className="landing-title">All your library work in one calm place.</h1>
                <p className="landing-text">
                    Keep collections tidy, help members faster, and see what's happening at a glance.
                    No clutter, just the tools you need.
                </p>
                <button className="get-started-btn" onClick={onGetStarted}>
                    Get Started
                    <FaArrowRight className="btn-icon" />
                </button>
            </div>
        </div>
    );
};

export default LandingPage;

