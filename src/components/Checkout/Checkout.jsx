import "./Checkout.css";

import emailIcon from "../../assets/emailIcon.svg";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import Success from "../Success/Success";

const schema = yup.object().shape({
  name: yup.string().required("Name is required."),
  surname: yup.string().required("Surname is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  address: yup.string().required("Address is required."),
  zip_code: yup.string().required("Zip code is required."),
});

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
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    surname: "",
    email: "",
    address: "",
    zip_code: "",
  });

  useEffect(() => {
    cart.forEach((item, idx) => {
      const itemKey = item.cartKey || `${item.id}-${idx}`;
      const prevT = prevTotals.current[itemKey];
      if (prevT !== undefined && prevT !== item.total_price) {
        const color = item.total_price > prevT ? "green" : "red";
        const ref = totalRefs.current[itemKey];
        if (ref) {
          ref.style.color = color;
          setTimeout(() => {
            ref.style.color = "#10151f";
          }, 1000);
        }
      }
      prevTotals.current[itemKey] = item.total_price;
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

  const handleValidation = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const validation = await handleValidation();
    if (validation) {
      setErrors(validation.errors || {});
      setSubmitting(false);
      return;
    }
    setErrors({});
    const cartData = new FormData();
    cartData.append("name", formValues.name);
    cartData.append("surname", formValues.surname);
    cartData.append("email", formValues.email);
    cartData.append("address", formValues.address);
    cartData.append("zip_code", formValues.zip_code);

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
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
      <div className="checkout">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="checkout-form">
            <h1>Order details</h1>

            <div className="inputs">
              <div className="grouped-inputs">
                <label htmlFor="name">
                  <input id="name" type="text" placeholder="Name" autoComplete="given-name" value={formValues.name} onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))} />
                  {errors.name &&
                    errors.name.map((msg, idx) => (
                      <p className="error-msg" key={idx}>
                        {msg}
                      </p>
                    ))}
                </label>
                <label htmlFor="surname">
                  <input id="surname" type="text" placeholder="Surname" autoComplete="family-name" value={formValues.surname} onChange={(e) => setFormValues((v) => ({ ...v, surname: e.target.value }))} />
                  {errors.surname &&
                    errors.surname.map((msg, idx) => (
                      <p className="error-msg" key={idx}>
                        {msg}
                      </p>
                    ))}
                </label>
              </div>
              <label htmlFor="email">
                <img src={emailIcon} />
                <input id="email" type="email" placeholder="Email" autoComplete="email" value={formValues.email} onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))} />
                {errors.email &&
                  errors.email.map((msg, idx) => (
                    <p className="error-msg" key={idx}>
                      {msg}
                    </p>
                  ))}
              </label>
              <div className="grouped-inputs">
                <label htmlFor="address">
                  <input id="address" type="text" placeholder="Address" autoComplete="street-address" value={formValues.address} onChange={(e) => setFormValues((v) => ({ ...v, address: e.target.value }))} />
                  {errors.address &&
                    errors.address.map((msg, idx) => (
                      <p className="error-msg" key={idx}>
                        {msg}
                      </p>
                    ))}
                </label>
                <label htmlFor="zip-code">
                  <input id="zip-code" type="number" placeholder="Zip code" autoComplete="postal-code" onKeyDown={blockInvalidKeys} value={formValues.zip_code} onChange={(e) => setFormValues((v) => ({ ...v, zip_code: e.target.value }))} />
                  {errors.zip_code &&
                    errors.zip_code.map((msg, idx) => (
                      <p className="error-msg" key={idx}>
                        {msg}
                      </p>
                    ))}
                </label>
              </div>
            </div>
          </form>

          <div className="checkout-cart">
            <div className="cart-items-wrapper">
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div className={"cart-item"} style={{ opacity: removingIds.includes(item.id) || submitting ? 0.5 : 1, pointerEvents: removingIds.includes(item.id) || submitting ? "none" : "auto" }} key={item.cartKey || `${item.id}-${idx}`}>
                    <img src={item.cover_image} alt={item.name} />

                    <div className="item-info">
                      <div className="item-details">
                        <div>
                          <p className="name">{item.name}</p>
                          <p className="color">{item.color}</p>
                          <p className="size">{item.size}</p>
                        </div>
                        <p className="price" ref={(el) => (totalRefs.current[item.cartKey || `${item.id}-${idx}`] = el)}>
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
              <p>Pay</p>
            </button>
          </div>
        </div>
        {showSuccessModal && <Success onClose={() => setShowSuccessModal(false)} />}
      </div>
    </>
  );
}

export default Checkout;
