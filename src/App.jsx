import "./App.css";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav/Nav";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Success from "./components/Success/Success";
import Product from "./components/Product/Product";
import ProductsList from "./components/ProductsList/ProductsList";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

function App() {
  const navigate = useNavigate();
  const { setCart } = useCart();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      fetch("https://api.redseam.redberryinternship.ge/api/cart", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok) setCart(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (window.location.pathname === "/") {
      navigate("/productsList");
    }
  }, [navigate]);

  return (
    <main>
      <Nav />
      <Routes>
        <Route path="/productsList" element={<ProductsList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </main>
  );
}

export default App;
