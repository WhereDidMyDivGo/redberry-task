import "./App.css";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav/Nav";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Success from "./components/Success/Success";
import Product from "./components/Product/Product";
import ProductsList from "./components/ProductsList/ProductsList";

function App() {
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
