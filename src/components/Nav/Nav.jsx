import "./Nav.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cart from "../Cart/Cart";

import handEye from "../../assets/HandEye.svg";
import cartIcon from "../../assets/cart.svg";
import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/arrow.svg";

function Nav() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const handleLogout = () => {
    localStorage.removeItem("avatar");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  const handleToggle = () => {
    setShowLogout((v) => !v);
  };

  let content;
  if (token) {
    const avatar = localStorage.getItem("avatar");

    content = (
      <div className="profile" style={{ position: "relative" }}>
        <img className="cartIcon" onClick={() => setCartOpen(true)} src={cartIcon} />
        <div>
          <img className="profileIcon" src={avatar || profileIcon} />
          <img className="nav-arrow" src={arrow} onClick={handleToggle} style={{ transform: showLogout ? "rotate(180deg)" : "rotate(0deg)" }} />
          {showLogout && (
            <button className="logout-button" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <Link to="/login" className="nav-login">
        <img src={profileIcon} />
        <p>Log in</p>
      </Link>
    );
  }

  return (
    <nav>
      <Link to="/productsList" className="logo">
        <img src={handEye} />
        <p>RedSeam Clothing</p>
      </Link>
      {content}
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </nav>
  );
}

export default Nav;
