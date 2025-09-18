import "./Header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cart from "../Cart/Cart";

import handEye from "../../assets/HandEye.svg";
import cartIcon from "../../assets/cart.svg";
import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/arrow.svg";

function Header({ token }) {
  const [cartOpen, setCartOpen] = useState(false);

  let content;
  if (token) {
    content = (
      <div className="profile">
        <img className="cartIcon" onClick={() => setCartOpen(true)} src={cartIcon} />
        <div>
          <img className="profileIcon" src={profileIcon} />
          <img src={arrow} />
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
