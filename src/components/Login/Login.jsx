import "./Login.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("The email field is required."),
  password: yup.string().required("The password field is required.").min(3, "Password must be at least 3 characters"),
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    try {
      await schema.validate({ email, password }, { abortEarly: false });
      return null;
    } catch (err) {
      const errorsObj = { errors: {} };
      if (err.inner && err.inner.length) {
        err.inner.forEach((e) => {
          if (!errorsObj.errors[e.path]) errorsObj.errors[e.path] = [e.message];
        });
      } else if (err.path) {
        errorsObj.errors[err.path] = [err.message];
      }
      return errorsObj;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validation = await handleValidation();
    if (validation) {
      RenderErrors(validation);
      setLoading(false);
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
          setLoading(false);
          return;
        }
        setLoading(false);
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
        if (data.errors) RenderErrors({ errors: data.errors });
        if (data.user && data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
        if (ok) window.location.href = "/productsList";
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  function RenderErrors({ errors }) {
    [...document.getElementsByClassName("error-msg")].forEach((el) => el.remove());

    const map = {
      email: "email",
      password: "password",
    };

    Object.entries(map).forEach(([key, id]) => {
      const msg = errors[key];
      const labels = document.getElementsByClassName(id);

      [...labels].forEach((label) => {
        const p = document.createElement("p");
        p.className = "error-msg";
        p.textContent = Array.isArray(msg) ? msg : msg;
        label.appendChild(p);
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
            <label htmlFor="login-email" className="email">
              <input id="login-email" autoComplete="email" type="email" placeholder="Email or username *" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label htmlFor="login-password" className="password">
              <input id="login-password" autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="toggle-password" type="button" onClick={() => setShowPassword((prev) => !prev)}>
                <img className="eyeIcon" src={showPassword ? closedEyeIcon : eyeIcon} alt={showPassword ? "Hide password" : "Show password"} />
              </button>
            </label>
          </div>

          <div className="login-actions">
            <button className="submit" type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
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
