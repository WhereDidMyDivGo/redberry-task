import "./Header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cart from "../Cart/Cart";

import handEye from "../../assets/HandEye.svg";
import cartIcon from "../../assets/cart.svg";
import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/arrow.svg";

function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  let content;
  if (token) {
    const avatar = localStorage.getItem("avatar");

    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = () => {
      localStorage.removeItem("avatar");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    };

    content = (
      <div className="profile" style={{ position: "relative" }}>
        <img className="cartIcon" onClick={() => setCartOpen(true)} src={cartIcon} />
        <div>
          <img className="profileIcon" src={avatar || profileIcon} />
          <img src={arrow} onClick={() => setShowLogout((v) => !v)} style={{ cursor: "pointer" }} />
          {showLogout && (
            <button
              className="logout-btn"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 10,
                marginTop: "4px",
              }}
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <Link to="/login" className="header-login">
        <img src={profileIcon} />
        <p>Log in</p>
      </Link>
    );
  }

  return (
    <div className="header">
      <div className="logo">
        <img src={handEye} />
        <p>RedSeam Clothing</p>
      </div>
      {content}
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </div>
  );
}

export default Header;
