import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const addProduct = (product) => {
    setCart((prevCart) => [
      ...prevCart,
      {
        ...product,
        total_price: product.price * product.quantity,
      },
    ]);
  };
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const removeProduct = async (productId) => {
    setRemovingIds((ids) => [...ids, productId]);
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
    try {
      await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return <CartContext.Provider value={{ cartOpen, setCartOpen, cart, setCart, removeProduct, removingIds, changeQuantity, addProduct }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
