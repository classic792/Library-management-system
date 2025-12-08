import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./termsConditions.css";

const TermsConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="terms-conditions-container">
      <h1>Terms and Conditions</h1>
      <div className="terms-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to the Book Management System. These terms and conditions
          outline the rules and regulations for the use of our system.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          When you create an account with us, you must provide us with
          information that is accurate, complete, and current at all times.
          Failure to do so constitutes a breach of the Terms, which may result
          in immediate termination of your account on our Service.
        </p>

        <h2>3. Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make
          available certain information, text, graphics, videos, or other
          material. You are responsible for the Content that you post on or
          through the Service, including its legality, reliability, and
          appropriateness.
        </p>

        <h2>4. Changes To Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material we will provide at
          least 30 days' notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion.
        </p>
      </div>
      <button onClick={() => navigate(-1)} className="back-button">
        Back to Register
      </button>
    </div>
  );
};

export default TermsConditions;
