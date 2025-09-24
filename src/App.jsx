import "./App.css";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav/Nav";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Checkout from "./components/Checkout/Checkout";
import Product from "./components/Product/Product";
import ProductsList from "./components/ProductsList/ProductsList";

import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const navigate = useNavigate();
  const { setCartFromAPI } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetch("https://api.redseam.redberryinternship.ge/api/cart", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data?.message || "Failed to fetch cart.");
            });
          }
          return res.json().then((data) => ({ ok: res.ok, data }));
        })
        .then(({ ok, data }) => {
          if (ok) setCartFromAPI(data);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to fetch cart.");
        });
    }
  }, [navigate, token]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
      <main>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/productsList" replace />} />
          <Route path="/productsList" element={<ProductsList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
