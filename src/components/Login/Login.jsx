import "./Login.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = (e) => {};

  return (
    <div className="login">
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Log in</h1>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <div className="email">
              <input type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
              {!(emailFocused || email) && (
                <>
                  <p onClick={() => emailRef.current && emailRef.current.focus()}>Email or username</p>
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
          </div>

          <div className="login-actions">
            <button className="submit" type="submit">
              <p>Log in</p>
            </button>

            <div className="register-link">
              <p>Not a member?</p>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
