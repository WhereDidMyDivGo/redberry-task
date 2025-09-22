import "./Cart.css";

import xIcon from "../../assets/xIcon.svg";
import emptyCart from "../../assets/emptyCart.svg";

import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { Link } from "react-router-dom";

function Cart({ onClose }) {
  const { cart, removeProduct, removingIds, changeQuantity, loadingIds } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const total = subtotal === 0 ? 0 : subtotal + 5;
  const [loading, setLoading] = useState(false);

  return (
    <div className="cart" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <h1>Shopping cart ({cart.length})</h1>
          <button type="button" className="close-cart" onClick={onClose}>
            <img src={xIcon} />
          </button>
        </header>

        {cart.length > 0 ? (
          <>
            <div className="cart-items-wrapper">
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div className={`cart-item${removingIds.includes(item.id) ? " removing" : ""}`} key={item.id || idx}>
                    <img src={item.cover_image} alt={item.name} />

                    <div className="item-info">
                      <div className="item-details">
                        <div>
                          <p className="name">{item.name}</p>
                          <p className="color">{item.color}</p>
                          <p className="size">{item.size}</p>
                        </div>
                        <p className="price">$ {item.total_price}</p>
                      </div>
                      <div className="item-controls">
                        <div className="amount">
                          <button type="button" className="decrease" style={{ color: item.quantity === 1 ? "#E1DFE1" : "#3E424A" }} disabled={item.quantity === 1} onClick={() => changeQuantity(item.id, "decrease")}>
                            -
                          </button>
                          <p>{item.quantity}</p>
                          <button type="button" className="increase" onClick={() => changeQuantity(item.id, "increase")}>
                            +
                          </button>
                        </div>
                        <button type="button" className="remove" onClick={() => removeProduct(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="cart-footer">
              <div className="cart-summary">
                <div>
                  <p>Items subtotal</p>
                  <p>$ {subtotal}</p>
                </div>
                <div>
                  <p>Delivery</p>
                  <p>$ 5</p>
                </div>
                <div className="total">
                  <p>Total</p>
                  <p>$ {total}</p>
                </div>
              </div>
              <button type="submit" className="checkout" disabled={loading || loadingIds} style={{ opacity: loading || loadingIds ? 0.6 : 1 }}>
                <p>Go to checkout</p>
              </button>
            </footer>
          </>
        ) : (
          <div className="cart-empty">
            <img src={emptyCart} />
            <h1>Ooops!</h1>
            <h2>You’ve got nothing in your cart just yet...</h2>
            <Link to={"/productsList"} onClick={onClose}>
              <p>Start shopping</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
