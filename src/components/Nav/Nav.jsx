import "./Nav.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Cart from "../Cart/Cart";

import handEye from "../../assets/HandEye.svg";
import navCartIcon from "../../assets/navCartIcon.svg";
import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/arrow.svg";

function Nav() {
  const { cartOpen, setCartOpen } = useCart();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "auto";
  }, [cartOpen]);

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
        <img className="cart-icon" onClick={() => setCartOpen(true)} src={navCartIcon} />
        <div>
          <img className="profile-icon" src={avatar || profileIcon} />
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
