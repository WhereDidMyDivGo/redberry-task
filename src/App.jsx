import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Success from "./components/Success/Success";
import Product from "./components/Product/Product";
import ProductsList from "./components/ProductsList/ProductsList";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </main>
  );
}

export default App;
