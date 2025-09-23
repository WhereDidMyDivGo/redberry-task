import "./Product.css";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useParams } from "react-router-dom";

import arrow from "../../assets/arrow.svg";
import cartIcon from "../../assets/cartIcon.svg";
import { string } from "yup";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const colorsRef = useRef(null);
  const sizesRef = useRef(null);
  const submitRef = useRef(null);
  const [shake, setShake] = useState(false);
  const [colorInvalid, setColorInvalid] = useState(false);
  const [sizeInvalid, setSizeInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setCartOpen, addProduct } = useCart();

  useEffect(() => {
    fetch(`https://api.redseam.redberryinternship.ge/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const addToCart = (e) => {
    e.preventDefault();
    let invalid = false;

    switch (true) {
      case !selectedColor:
        setColorInvalid(true);
        invalid = true;
        setTimeout(() => setColorInvalid(false), 1500);
      case !selectedSize:
        setSizeInvalid(true);
        invalid = true;
        setTimeout(() => setSizeInvalid(false), 1500);
        break;
      default:
        break;
    }

    if (invalid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    addProduct({
      id,
      name: product.name,
      price: product.price,
      cover_image: product.cover_image,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });

    setLoading(true);
    const cartData = new FormData();
    cartData.append("quantity", quantity);
    cartData.append("color", selectedColor);
    cartData.append("size", selectedSize);

    fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1]
        }`,
      },
      body: cartData,
    })
      .then((res) => {
        setLoading(false);
        if (res.ok) setCartOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="product-container">
      <p className="page-title">Listing / Product</p>
      <form className="product-content" onSubmit={(e) => addToCart(e)}>
        <div className="pictures">
          <div className="mini-pics-list">{product && product.images ? product.images.map((img, idx) => <img key={idx} className="mini-pic" src={img} />) : Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="shimmer shimmer-mini-pic" />)}</div>
          {product && product.cover_image ? <img className="main-pic" src={product.cover_image} alt={product.name} /> : <div className="shimmer shimmer-main-pic" />}
        </div>
        <div className="info">
          <header className="info-header">
            {product && product.name ? <h1 className="name">{product.name}</h1> : <div className="shimmer shimmer-name" />}
            {product && product.price ? <h1 className="price">$ {product.price}</h1> : <div className="shimmer shimmer-price" />}
          </header>

          <div className="options">
            <div className={`colors ${colorInvalid ? "invalid" : ""}`} ref={colorsRef}>
              <p>Color: {selectedColor ? selectedColor : "Select color"}</p>
              <div className="available-colors">
                {product && product.available_colors
                  ? product.available_colors.map((color, idx) => (
                      <button type="button" key={idx} style={{}} onClick={() => setSelectedColor(color)} className={selectedColor === color ? "selected" : ""}>
                        <span style={{ backgroundColor: color }}></span>
                      </button>
                    ))
                  : Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="shimmer shimmer-color" />)}
              </div>
            </div>

            <div className={`sizes ${sizeInvalid ? "invalid" : ""}`} ref={sizesRef}>
              <p>Size: {selectedSize ? selectedSize : "Select size"}</p>
              <div className="available-sizes">
                {product && product.available_sizes
                  ? product.available_sizes.map((size, idx) => (
                      <button type="button" key={idx} onClick={() => setSelectedSize(size)} className={selectedSize === size ? "selected" : ""}>
                        <p>{size}</p>
                      </button>
                    ))
                  : Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="shimmer shimmer-size" />)}
              </div>
            </div>

            <div className="quantity">
              <p>Quantity</p>
              <select className="quantity-select" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} disabled={product === null}>
                {[...Array(10)].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className={`submit ${shake ? "shake" : ""}`} type="submit" disabled={product === null || loading} ref={submitRef} style={{ opacity: loading ? 0.6 : 1 }}>
            <img src={cartIcon} />
            <p>Add to cart</p>
          </button>

          <span className="line"></span>

          <div className="details">
            <header className="details-header">
              <h1>Details</h1>
              {product ? <img src={product.brand.image} /> : <div className="shimmer shimmer-details-img" />}
            </header>

            <div className="product-meta">
              {product && product.brand ? <p className="brand">Brand: {product.brand.name}</p> : <div className="shimmer shimmer-brand" />}
              {product && product.description ? <p className="description">{product.description}</p> : <div className="shimmer shimmer-description" />}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Product;
