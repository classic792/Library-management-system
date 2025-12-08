import { apiRequest } from "../../api";
import React, { useState } from "react";
import "./LoginRegister.css";
import { FaUser, FaLock, FaEnvelope, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setRegisterEmail(value);
    if (!value) {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginMessage("Fill in username and password");
      return;
    }
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: { identifier: loginUsername, password: loginPassword },
      });
      localStorage.setItem("userToken", response.token);
      // optionally store role/data
      setLoginMessage("Login successful");
      navigate("/user/dashboard"); // once you import useNavigate
    } catch (error) {
      setLoginMessage(error.message);
      // setTimeout(() => setLoginMessage(""), 3000);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (
      !registerFirstName ||
      !registerLastName ||
      !registerUsername ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setRegisterMessage("Please complete all fields");
      return;
    }
    if (emailError) {
      setEmailError((prev) => prev || "Enter a valid email address");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterMessage("Passwords do not match");
      return;
    }
    if (!termsChecked) {
      setRegisterMessage("Please accept the terms to continue");
      return;
    }
    try {
      const response = await apiRequest("/auth/signup", {
        method: "POST",
        body: {
          firstName: registerFirstName,
          lastName: registerLastName,
          alias: registerUsername,
          email: registerEmail,
          password: registerPassword,
          confirmPassword: registerConfirmPassword,
          role: "member",
        },
      });
      localStorage.setItem("userToken", response.token);
      setRegisterMessage("Registration successful");
      navigate("/user/dashboard");
    } catch (error) {
      setRegisterMessage(error.message);
    }
  };

  return (
    <div className={`wrapper${action}`}>
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit} noValidate>
          <h1>User Login</h1>
          <div className="user-input-box">
            <input
              type="text"
              placeholder="Username or Email"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="user-input-box">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <span
              className="icon"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              style={{ cursor: "pointer" }}>
              {showLoginPassword ? <FaEyeSlash /> : <FaLock />}
            </span>
          </div>

          <div className="user-remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgotPassword">Forgot password?</Link>
          </div>

          <button type="submit" disabled={!loginUsername || !loginPassword}>
            Login
          </button>
          {loginMessage && (
            <p className="feedback-msg" aria-live="polite">
              {loginMessage}
            </p>
          )}

          <div className="user-register-link">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit} noValidate>
          <h1>User Registration</h1>
          <div className="user-input-box">
            <input
              type="text"
              placeholder="First Name"
              required
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="user-input-box">
            <input
              type="text"
              placeholder="Last Name"
              required
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="user-input-box">
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="user-input-box">
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={handleEmailChange}
              required
              className={emailError ? "input-error" : ""}
            />
            <FaEnvelope className="icon" />
          </div>
          {emailError && <p className="error-msg">{emailError}</p>}
          <div className="user-input-box">
            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <span
              className="icon"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              style={{ cursor: "pointer" }}>
              {showRegisterPassword ? <FaEyeSlash /> : <FaLock />}
            </span>
          </div>
          <div className="user-input-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
              className={
                registerConfirmPassword &&
                registerPassword !== registerConfirmPassword
                  ? "input-error"
                  : ""
              }
            />
            <span
              className="icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer" }}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaLock />}
            </span>
          </div>
          {registerConfirmPassword &&
            registerPassword !== registerConfirmPassword && (
              <p className="error-msg">Passwords must match</p>
            )}

          <div className="user-remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
              />
              I agree to the <Link to="/termsConditions">terms & conditions</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={
              !!emailError ||
              !termsChecked ||
              !registerFirstName ||
              !registerLastName ||
              !registerUsername ||
              !registerEmail ||
              !registerPassword ||
              !registerConfirmPassword ||
              registerPassword !== registerConfirmPassword
            }>
            Register
          </button>
          {registerMessage && (
            <p className="feedback-msg" aria-live="polite">
              {registerMessage}
            </p>
          )}

          <div className="user-register-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={loginLink}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginRegister;
