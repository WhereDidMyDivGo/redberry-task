import "./Register.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const confirmPasswordRef = useRef(null);

  const handleRegister = (e) => {};

  return (
    <div className="register">
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Registration</h1>
        <form onSubmit={handleRegister}>
          <div className="inputs">
            <div className="username">
              <input type="text" ref={usernameRef} value={username} onChange={(e) => setUsername(e.target.value)} onFocus={() => setUsernameFocused(true)} onBlur={() => setUsernameFocused(false)} />
              {!(usernameFocused || username) && (
                <>
                  <p onClick={() => usernameRef.current && usernameRef.current.focus()}>Username</p>
                  <span onClick={() => usernameRef.current && usernameRef.current.focus()}>*</span>
                </>
              )}
            </div>
            <div className="email">
              <input type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
              {!(emailFocused || email) && (
                <>
                  <p onClick={() => emailRef.current && emailRef.current.focus()}>Email</p>
                  <span onClick={() => emailRef.current && emailRef.current.focus()}>*</span>
                </>
              )}
            </div>
            <div className="password">
              <input type={showPassword ? "text" : "password"} ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
              {!(passwordFocused || password) && (
                <>
                  <p onClick={() => passwordRef.current && passwordRef.current.focus()}>Password</p>
                  <span onClick={() => passwordRef.current && passwordRef.current.focus()}>*</span>
                </>
              )}
              <button className="toggle-password" type="button" onClick={() => setShowPassword((prev) => !prev)}>
                <img className="eyeIcon" src={showPassword ? closedEyeIcon : eyeIcon} alt={showPassword ? "Hide password" : "Show password"} />
              </button>
            </div>
            <div className="confirm-password">
              <input type={showConfirmPassword ? "text" : "password"} ref={confirmPasswordRef} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setConfirmPasswordFocused(true)} onBlur={() => setConfirmPasswordFocused(false)} />
              {!(confirmPasswordFocused || confirmPassword) && (
                <>
                  <p onClick={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()}>Confirm Password</p>
                  <span onClick={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()}>*</span>
                </>
              )}
              <button className="toggle-password" type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                <img className="eyeIcon" src={showConfirmPassword ? closedEyeIcon : eyeIcon} alt={showConfirmPassword ? "Hide password" : "Show password"} />
              </button>
            </div>
          </div>

          <div className="register-actions">
            <button className="submit" type="submit">
              <p>Register</p>
            </button>

            <div className="register-link">
              <p>Already member?</p>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
