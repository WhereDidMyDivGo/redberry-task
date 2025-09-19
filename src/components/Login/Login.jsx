import "./Login.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("The email field is required."),
  password: yup.string().required("The password field is required."),
});

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleValidation = async () => {
    try {
      await schema.validate({ email, password }, { abortEarly: false });
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = await handleValidation();
    if (validation) {
      RenderErrors(validation);
      console.log(validation);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    fetch("https://api.redseam.redberryinternship.ge/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (data.message === "Unauthenticated.") {
          RenderErrors({
            errors: {
              email: ["Incorrect email or password."],
              password: ["Incorrect email or password."],
            },
          });
          return;
        }
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
        if (data.errors) RenderErrors({ errors: data.errors });
        console.log(data);
        if (data.user && data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
        if (ok) window.location.href = "/productsList";
      })
      .catch((err) => console.log(err));
  };

  function RenderErrors({ errors }) {
    [...document.getElementsByClassName("error-msg")].forEach((el) => el.remove());

    const map = {
      email: "email",
      password: "password",
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

  return (
    <div className="login">
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Log in</h1>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <div className="email">
              <input autoComplete="email" type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
              {!(emailFocused || email) && (
                <>
                  <p onClick={() => emailRef.current && emailRef.current.focus()}>Email or username</p>
                  <span onClick={() => emailRef.current && emailRef.current.focus()}>*</span>
                </>
              )}
            </div>
            <div className="password">
              <input autoComplete="current-password" type={showPassword ? "text" : "password"} ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
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
