import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { FaUser, FaLock, FaEnvelope, FaEyeSlash } from "react-icons/fa";
import { apiRequest } from "../../api";
const AdminLogin = () => {
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

  const registerLink = () => setAction(" active");
  const loginLink = () => setAction("");

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setRegisterEmail(value);
    if (!value) setEmailError("Email is required");
    else if (!validateEmail(value))
      setEmailError("Enter a valid email address");
    else setEmailError("");
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginMessage("Fill in username and password");
      return;
    }

    // Mock successful login
    setLoginMessage("Login successful!");
    setTimeout(() => {
      setLoginMessage("");
      navigate("/admin/dashboard"); // Navigate to AdminDashboard
    }, 1000);
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
          role: "admin",
        },
      });
      localStorage.setItem("adminToken", response.token);
      setRegisterMessage("Registration successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      setRegisterMessage(error.message);
    }
  };

  return (
    <div className={`admin-wrapper${action}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit} noValidate>
          <h1>Admin Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
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

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" disabled={!loginUsername || !loginPassword}>
            Login
          </button>
          {loginMessage && (
            <p className="feedback-msg" aria-live="polite">
              {loginMessage}
            </p>
          )}

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit} noValidate>
          <h1>Admin Registration</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="First Name"
              required
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Last Name"
              required
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
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

          <div className="input-box">
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

          <div className="input-box">
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

          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
              />
              I agree to the terms & conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={
              !!emailError ||
              !termsChecked ||
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

          <div className="register-link">
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

export default AdminLogin;
