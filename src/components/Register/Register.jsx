import "./Register.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";
import profile from "../../assets/profile.svg";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required("The username field is required."),
  email: yup.string().email("Invalid email").required("The email field is required."),
  password: yup.string().required("The password field is required."),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "The password field confirmation does not match."),
});

function Register() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleValidation = async () => {
    try {
      await schema.validate({ username, email, password, confirmPassword }, { abortEarly: false });
      return null;
    } catch (err) {
      const errorsObj = { errors: {} };
      if (err.inner && err.inner.length) {
        err.inner.forEach((e) => {
          if (!errorsObj.errors[e.path]) errorsObj.errors[e.path] = [];
          errorsObj.errors[e.path].push(e.message);
        });
      } else if (err.path) {
        errorsObj.errors[err.path] = [err.message];
      }
      return errorsObj;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validation = await handleValidation();
    if (validation) {
      RenderErrors(validation);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    if (avatarFile) formData.append("avatar", avatarFile);

    fetch("https://api.redseam.redberryinternship.ge/api/register", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
        if (data.errors) RenderErrors({ errors: data.errors });
        if (data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
        if (ok) window.location.href = "/productsList";
      })
      .catch((err) => console.log(err));
  };

  function RenderErrors({ errors }) {
    [...document.getElementsByClassName("error-msg")].forEach((el) => el.remove());

    const map = {
      username: "username",
      email: "email",
      password: "password",
      confirmPassword: "password",
    };

    Object.entries(map).forEach(([key, id]) => {
      const msg = errors[key];
      const divs = document.getElementsByClassName(id);

      [...divs].forEach((div) => {
        const p = document.createElement("p");
        p.className = "error-msg";
        p.textContent = Array.isArray(msg) ? msg : msg;
        div.appendChild(p);
      });
    });
  }

  const handleAvatar = (e) => {
    if (avatar !== profile) URL.revokeObjectURL(avatar);

    if (e === "reset") {
      setAvatar(profile);
      setAvatarFile(null);
    } else {
      setAvatar(URL.createObjectURL(e.target.files[0]));
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="register">
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Registration</h1>
        <form onSubmit={handleRegister}>
          <div className="pfp">
            <img src={avatar} />
            <label>
              <p>Upload new</p>
              <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatar} />
            </label>
            <p onClick={() => handleAvatar("reset")}>Remove</p>
          </div>

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
              <input autoComplete="email" type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
              {!(emailFocused || email) && (
                <>
                  <p onClick={() => emailRef.current && emailRef.current.focus()}>Email</p>
                  <span onClick={() => emailRef.current && emailRef.current.focus()}>*</span>
                </>
              )}
            </div>
            <div className="password">
              <input autoComplete="new-password" type={showPassword ? "text" : "password"} ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
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
            <div className="password">
              <input autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} ref={confirmPasswordRef} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setConfirmPasswordFocused(true)} onBlur={() => setConfirmPasswordFocused(false)} />
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
            <div className="login-link">
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
