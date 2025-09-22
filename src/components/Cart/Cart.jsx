import "./Cart.css";

import xIcon from "../../assets/xIcon.svg";

function Cart({ onClose }) {
  return (
    <div className="cart" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <h1>Shopping cart (2)</h1>
          <button className="close-cart">
            <img src={xIcon} />
          </button>
        </header>
        <div className="cart-items-wrapper">
          <div className="cart-items">
            <div className="cart-item">
              <img src="" alt="" />

              <div className="item-info">
                <div className="item-details">
                  <div>
                    <p className="name">Kids' Curved Hilfiger Graphic T-Shirt</p>
                    <p className="color">Baby pink</p>
                    <p className="size">L</p>
                  </div>
                  <p className="price">$ 25</p>
                </div>
                <div className="item-controls">
                  <div className="amount">
                    <button className="decrease">-</button>
                    <p>1</p>
                    <button className="increase">+</button>
                  </div>
                  <button className="remove">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="cart-footer">
          <div className="cart-summary">
            <div>
              <p>Items subtotal</p>
              <p>$ 50</p>
            </div>
            <div>
              <p>Delivery</p>
              <p>$ 5</p>
            </div>
            <div className="total">
              <p>Total</p>
              <p>$ 55</p>
            </div>
          </div>
          <button className="checkout">
            <p>Go to checkout</p>
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Cart;
