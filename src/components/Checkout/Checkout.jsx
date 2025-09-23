import "./Checkout.css";

import emailIcon from "../../assets/emailIcon.svg";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Success from "../Success/Success";
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

function Checkout() {
  const { token } = useAuth();
  const { cart, removeProduct, removingIds, changeQuantity, loadingIds, setCart } = useCart();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const total = subtotal === 0 ? 0 : subtotal + 5;
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    const form = e.target;
    const cartData = new FormData();
    cartData.append("name", form.name.value);
    cartData.append("surname", form.surname.value);
    cartData.append("email", form.email.value);
    cartData.append("address", form.address.value);
    cartData.append("zip_code", form["zip-code"].value);

    fetch("https://api.redseam.redberryinternship.ge/api/cart/checkout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: cartData,
    })
      .then((res) => {
        setSubmitting(false);
        return res.json().then((data) => {
          if (!res.ok) {
            throw new Error(data?.message || "Checkout failed.");
          }
          setCart([]);
          setShowSuccessModal(true);
        });
      })
      .catch((err) => {
        setSubmitting(false);
        toast.error(err.message || "Checkout failed.");
      });
  };

  return (
    <div className="checkout">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
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
                <div className={"cart-item"} style={{ opacity: removingIds.includes(item.id) || submitting ? 0.5 : 1, pointerEvents: removingIds.includes(item.id) || submitting ? "none" : "auto" }} key={item.id || idx}>
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

          <button type="submit" className="submit" form="checkout-form" disabled={submitting || loadingIds.length > 0 || cart.length === 0} style={{ opacity: submitting || loadingIds.length > 0 || cart.length === 0 ? 0.6 : 1 }}>
            <p>Go to checkout</p>
          </button>
        </div>
      </div>
      {showSuccessModal && <Success onClose={() => setShowSuccessModal(false)} />}
    </div>
  );
}

export default Checkout;
