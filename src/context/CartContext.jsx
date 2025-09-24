import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const { token } = useAuth();

  const getColorImage = (images, availableColors, selectedColor) => {
    if (!images || !availableColors || !selectedColor) return images?.[0] || null;
    const colorIndex = availableColors.findIndex((color) => color.toLowerCase() === selectedColor.toLowerCase());
    return colorIndex >= 0 && images[colorIndex] ? images[colorIndex] : images[0];
  };

  const addProduct = (product) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => String(item.id) === String(product.id) && item.color === product.color && item.size === product.size);

      if (idx !== -1) {
        const updated = [...prevCart];
        const existing = updated[idx];
        const newQuantity = existing.quantity + product.quantity;
        updated[idx] = {
          ...existing,
          cartKey: existing.cartKey || `${existing.id}-${existing.color}-${existing.size}`,
          quantity: newQuantity,
          total_price: existing.price * newQuantity,
        };
        return updated;
      } else {
        const cartKey = `${product.id}-${product.color}-${product.size}`;
        const colorImage = getColorImage(product.images, product.available_colors, product.color);
        return [
          ...prevCart,
          {
            ...product,
            cartKey,
            cover_image: colorImage,
            total_price: product.price * product.quantity,
          },
        ];
      }
    });
  };

  const removeProduct = async (cartItem) => {
    const productId = cartItem.id;
    setRemovingIds((ids) => [...ids, productId]);
    setLoadingIds((ids) => [...ids, productId]);
    try {
      const res = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color: cartItem.color,
          size: cartItem.size,
        }),
      });
      if (res.ok) {
        setCart((prevCart) => prevCart.filter((item) => item.cartKey !== cartItem.cartKey));
        setLoadingIds((ids) => ids.filter((id) => id !== productId));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRemovingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const changeQuantity = async (cartItem, action) => {
    const productId = cartItem.id;
    let newQuantity = cartItem.quantity;

    if (action === "increase") {
      newQuantity = cartItem.quantity + 1;
    } else if (action === "decrease" && cartItem.quantity > 1) {
      newQuantity = cartItem.quantity - 1;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.cartKey !== cartItem.cartKey) return item;
        const pricePerUnit = item.total_price / item.quantity;
        return { ...item, quantity: newQuantity, total_price: pricePerUnit * newQuantity };
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
        body: JSON.stringify({
          quantity: newQuantity,
          color: cartItem.color,
          size: cartItem.size,
        }),
      });
      setLoadingIds((ids) => ids.filter((id) => id !== productId));
    } catch (err) {
      console.log(err);
      setLoadingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const setCartFromAPI = (cartData) => {
    const normalizedCart = cartData.map((item) => {
      const colorImage = getColorImage(item.images, item.available_colors, item.color);
      return {
        ...item,
        cartKey: `${item.id}-${item.color}-${item.size}`,
        cover_image: colorImage,
      };
    });
    setCart(normalizedCart);
  };

  return <CartContext.Provider value={{ cartOpen, setCartOpen, cart, setCart, setCartFromAPI, removeProduct, removingIds, changeQuantity, addProduct, loadingIds }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
