import "./Checkout.css";

import emailIcon from "../../assets/emailIcon.svg";

import { useCart } from "../../context/CartContext";
import { useState, useRef, useEffect } from "react";

function Checkout() {
  const { cart, removeProduct, removingIds, changeQuantity, loadingIds } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const total = subtotal === 0 ? 0 : subtotal + 5;
  const [loading, setLoading] = useState(false);
  const totalRefs = useRef({});
  const cartTotalRef = useRef();
  const prevTotals = useRef({});
  const prevCartTotal = useRef(total);

  useEffect(() => {
    cart.forEach((item) => {
      const prevT = prevTotals.current[item.id];
      if (prevT !== undefined && prevT !== item.total_price) {
        const color = item.total_price > prevT ? "green" : "red";
        const ref = totalRefs.current[item.id];
        if (ref) {
          ref.style.color = color;
          setTimeout(() => {
            ref.style.color = "#10151f";
          }, 1000);
        }
      }
      prevTotals.current[item.id] = item.total_price;
    });
  }, [cart]);

  useEffect(() => {
    if (prevCartTotal.current !== undefined && prevCartTotal.current !== total) {
      const color = total > prevCartTotal.current ? "green" : "red";
      if (cartTotalRef.current) {
        cartTotalRef.current.style.color = color;
        setTimeout(() => {
          cartTotalRef.current.style.color = "#10151f";
        }, 1000);
      }
    }
    prevCartTotal.current = total;
  }, [total]);

  const blockInvalidKeys = (e) => {
    if (e.key === "-" || e.key === "+" || e.key === "e") e.preventDefault();
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    //
  };

  return (
    <div className="checkout">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-content">
        <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="checkout-form">
          <h1>Order details</h1>

          <div className="inputs">
            <div className="grouped-inputs">
              <label htmlFor="name">
                <input id="name" type="text" placeholder="Name" autoComplete="given-name" required />
              </label>
              <label htmlFor="surname">
                <input id="surname" type="text" placeholder="Surname" autoComplete="family-name" required />
              </label>
            </div>
            <label htmlFor="email">
              <img src={emailIcon} />
              <input id="email" type="email" placeholder="Email" autoComplete="email" required />
            </label>
            <div className="grouped-inputs">
              <label htmlFor="address">
                <input id="address" type="text" placeholder="Address" autoComplete="street-address" required />
              </label>
              <label htmlFor="zip-code">
                <input id="zip-code" type="number" placeholder="Zip code" autoComplete="postal-code" onKeyDown={blockInvalidKeys} required />
              </label>
            </div>
          </div>
        </form>

        <div className="checkout-cart">
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
                      <p className="price" ref={(el) => (totalRefs.current[item.id] = el)}>
                        $ {item.total_price}
                      </p>
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
              <p ref={cartTotalRef}>$ {total}</p>
            </div>
          </div>

          <button type="submit" className="submit" form="checkout-form" disabled={loading || loadingIds} style={{ opacity: loading || loadingIds ? 0.6 : 1 }}>
            <p>Go to checkout</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
