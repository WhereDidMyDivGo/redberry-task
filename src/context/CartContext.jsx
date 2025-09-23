import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const { token } = useAuth();

  const addProduct = (product) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => String(item.id) === String(product.id));
      if (idx !== -1) {
        const updated = [...prevCart];
        const existing = updated[idx];
        const newQuantity = existing.quantity + product.quantity;
        updated[idx] = {
          ...existing,
          quantity: newQuantity,
          total_price: existing.price * newQuantity,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            total_price: product.price * product.quantity,
          },
        ];
      }
    });
  };

  const removeProduct = async (productId) => {
    setRemovingIds((ids) => [...ids, productId]);
    setLoadingIds((ids) => [...ids, productId]);
    try {
      const res = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        setLoadingIds((ids) => ids.filter((id) => id !== productId));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRemovingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const changeQuantity = async (productId, action) => {
    let newQuantity = 1;
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        newQuantity = item.quantity;
        if (action === "increase") newQuantity = item.quantity + 1;
        if (action === "decrease" && item.quantity > 1) newQuantity = item.quantity - 1;
      }
      return prevCart.map((item) => {
        if (item.id !== productId) return item;
        if (action === "increase") return { ...item, quantity: item.quantity + 1, total_price: (item.total_price / item.quantity) * (item.quantity + 1) };
        if (action === "decrease" && item.quantity > 1) return { ...item, quantity: item.quantity - 1, total_price: (item.total_price / item.quantity) * (item.quantity - 1) };
        return item;
      });
    });
    setLoadingIds((ids) => [...ids, productId]);
    try {
      const res = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      setLoadingIds((ids) => ids.filter((id) => id !== productId));
    } catch (err) {
      console.log(err);
      setLoadingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  return <CartContext.Provider value={{ cartOpen, setCartOpen, cart, setCart, removeProduct, removingIds, changeQuantity, addProduct, loadingIds }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
