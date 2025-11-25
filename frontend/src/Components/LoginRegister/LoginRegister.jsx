import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleEmailChange = (event) => {
        const { value } = event.target;
        setRegisterEmail(value);
        if (!value) {
            setEmailError('Email is required');
        } else if (!validateEmail(value)) {
            setEmailError('Enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        setLoginMessage('All good');
        setTimeout(() => setLoginMessage(''), 3000);
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        if (!registerEmail || emailError) {
            setEmailError((prev) => prev || 'Enter a valid email address');
            return;
        }
        if (!termsChecked) {
            setRegisterMessage('Please accept the terms to continue');
            return;
        }
        setRegisterMessage('All good');
        setTimeout(() => setRegisterMessage(''), 3000);
    };

    return (
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLoginSubmit} noValidate>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required/>
                        <FaLock className="icon" /> 
                    </div>
                    
                    <div className="remember-forgot">
                        <label><input type="checkbox"/>Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type="submit">Login</button>
                    {loginMessage && <p className="feedback-msg" aria-live="polite">{loginMessage}</p>}

                    <div className="register-link">
                        <p>Don't have an account? <a href='#' onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegisterSubmit} noValidate>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={registerEmail}
                            onChange={handleEmailChange}
                            required
                            className={emailError ? 'input-error' : ''}
                        />
                        <FaEnvelope className="icon"/>
                    </div>
                    {emailError && <p className="error-msg">{emailError}</p>}
                    <div className="input-box">
                        <input type="password" placeholder="Password" required/>
                        <FaLock className="icon" /> 
                    </div>
                    
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

                    <button type="submit" disabled={!!emailError || !termsChecked}>Register</button>
                    {registerMessage && <p className="feedback-msg" aria-live="polite">{registerMessage}</p>}

                    <div className="register-link">
                        <p>Already have an account? <a href='#' onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;