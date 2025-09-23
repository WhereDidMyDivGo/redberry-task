import "./Login.css";

import hero from "../../assets/hero.png";
import eyeIcon from "../../assets/eyeIcon.svg";
import closedEyeIcon from "../../assets/closedEyeIcon.svg";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("The email field is required."),
  password: yup.string().required("The password field is required.").min(3, "Password must be at least 3 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      setErrors(validation.errors || {});
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

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
          setErrors({
            email: ["Incorrect email or password."],
            password: ["Incorrect email or password."],
          });
          setLoading(false);
          return;
        }
        setLoading(false);
        login(data);
        if (data.errors) setErrors(data.errors);
        if (data.user && data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
        if (ok) navigate("/productsList");
      })
      .catch((err) => {
        toast.error(err.message || "Login failed.");
        setLoading(false);
      });
  };

  return (
    <div className="login">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Log in</h1>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <label htmlFor="login-email" className="email">
              <input id="login-email" autoComplete="email" type="email" placeholder="Email or username *" value={formValues.email} onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))} />
              {errors.email &&
                errors.email.map((msg, idx) => (
                  <p className="error-msg" key={idx}>
                    {msg}
                  </p>
                ))}
            </label>
            <label htmlFor="login-password" className="password">
              <input id="login-password" autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Password *" value={formValues.password} onChange={(e) => setFormValues((v) => ({ ...v, password: e.target.value }))} />
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
};

export default Login;
