import "./Register.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";
import profile from "../../assets/profile.svg";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required("The username field is required.").min(3, "Username must be at least 3 characters"),
  email: yup.string().email("Invalid email").required("The email field is required."),
  password: yup.string().required("The password field is required.").min(3, "Password must be at least 3 characters"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "The password field confirmation does not match."),
});

function Register() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleValidation = async () => {
    try {
      await schema.validate({ username, email, password, confirmPassword }, { abortEarly: false });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validation = await handleValidation();
    if (validation) {
      setErrors(validation.errors || {});
      setLoading(false);
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
        setLoading(false);
        login(data);
        if (data.errors) setErrors(data.errors);
        if (data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
        if (ok) navigate("/productsList");
      })
      .catch((err) => {
        toast.error(err.message || "Registration failed.");
        setLoading(false);
      });
  };

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
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
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
            <label htmlFor="register-username" className="username">
              <input id="register-username" type="text" placeholder="Username *" value={username} onChange={(e) => setUsername(e.target.value)} />
              {errors.username &&
                errors.username.map((msg, idx) => (
                  <p className="error-msg" key={idx}>
                    {msg}
                  </p>
                ))}
            </label>
            <label htmlFor="register-email" className="email">
              <input id="register-email" autoComplete="email" type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email &&
                errors.email.map((msg, idx) => (
                  <p className="error-msg" key={idx}>
                    {msg}
                  </p>
                ))}
            </label>
            <label htmlFor="register-password" className="password">
              <input id="register-password" autoComplete="new-password" type={showPassword ? "text" : "password"} placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="toggle-password" type="button" onClick={() => setShowPassword((prev) => !prev)}>
                <img className="eye-icon" src={showPassword ? closedEyeIcon : eyeIcon} alt={showPassword ? "Hide password" : "Show password"} />
              </button>
              {errors.password &&
                errors.password.map((msg, idx) => (
                  <p className="error-msg" key={idx}>
                    {msg}
                  </p>
                ))}
            </label>
            <label htmlFor="register-confirm-password" className="confirm-password">
              <input id="register-confirm-password" autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button className="toggle-password" type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                <img className="eye-icon" src={showConfirmPassword ? closedEyeIcon : eyeIcon} alt={showConfirmPassword ? "Hide password" : "Show password"} />
              </button>
              {errors.confirmPassword &&
                errors.confirmPassword.map((msg, idx) => (
                  <p className="error-msg" key={idx}>
                    {msg}
                  </p>
                ))}
            </label>
          </div>

          <div className="register-actions">
            <button className="submit" type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
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
