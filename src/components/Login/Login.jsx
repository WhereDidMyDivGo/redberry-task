import "./Login.css";

import hero from "../../assets/hero.png";

function Login() {
  return (
    <div className="login">
      <img className="hero" src={hero} />

      <div className="form-wrapper">
        <h1>Log in</h1>
        <form action="">
          <div className="inputs">
            <div className="email">
              <input required type="email" />
              <p>Email or username</p>
              <span>*</span>
            </div>
            <div className="password">
              <input required type="password" />
              <p>Password</p>
              <span>*</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
