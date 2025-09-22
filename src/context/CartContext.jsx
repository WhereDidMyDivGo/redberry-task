import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const [removingIds, setRemovingIds] = useState([]);

  const removeProduct = async (productId) => {
    setRemovingIds((ids) => [...ids, productId]);
    try {
      const res = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]
          }`,
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

  return <CartContext.Provider value={{ cartOpen, setCartOpen, cart, setCart, removeProduct, removingIds }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
