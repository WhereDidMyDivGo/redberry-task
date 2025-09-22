import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

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
    setLoadingIds(true);
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
        setLoadingIds(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRemovingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const changeQuantity = async (productId, action) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) return item;
        if (action === "increase") return { ...item, quantity: item.quantity + 1, total_price: (item.total_price / item.quantity) * (item.quantity + 1) };
        if (action === "decrease" && item.quantity > 1) return { ...item, quantity: item.quantity - 1, total_price: (item.total_price / item.quantity) * (item.quantity - 1) };
        return item;
      })
    );
    const item = cart.find((i) => i.id === productId);
    let newQuantity = item.quantity;
    if (action === "increase") newQuantity = item.quantity + 1;
    if (action === "decrease" && item.quantity > 1) newQuantity = item.quantity - 1;
    setLoadingIds(true);
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
      if (res.ok) setLoadingIds(false);
    } catch (err) {
      console.log(err);
    }
  };

  return <CartContext.Provider value={{ cartOpen, setCartOpen, cart, setCart, removeProduct, removingIds, changeQuantity, addProduct, loadingIds }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
