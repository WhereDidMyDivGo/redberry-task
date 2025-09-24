import "./Product.css";

import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useParams, useNavigate } from "react-router-dom";

import cartIcon from "../../assets/cartIcon.svg";

function Product() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [imageTransitioning, setImageTransitioning] = useState(false);
  const [shake, setShake] = useState(false);
  const [colorInvalid, setColorInvalid] = useState(false);
  const [sizeInvalid, setSizeInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setCartOpen, addProduct } = useCart();

  const getColorImage = (images, availableColors, selectedColor) => {
    if (!images || !availableColors || !selectedColor) return images?.[0] || null;
    const colorIndex = availableColors.findIndex((color) => color.toLowerCase() === selectedColor.toLowerCase());
    return colorIndex >= 0 && images[colorIndex] ? images[colorIndex] : images[0];
  };

  useEffect(() => {
    fetch(`https://api.redseam.redberryinternship.ge/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data?.message || "Failed to fetch product.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.cover_image);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch product.");
      });
  }, [id]);

  const addToCart = (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    let invalid = false;

    if (!selectedColor) {
      setColorInvalid(true);
      invalid = true;
      setTimeout(() => setColorInvalid(false), 1500);
    }

    if (!selectedSize) {
      setSizeInvalid(true);
      invalid = true;
      setTimeout(() => setSizeInvalid(false), 1500);
    }

    if (invalid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    const cartData = new FormData();
    cartData.append("quantity", quantity);
    cartData.append("color", selectedColor);
    cartData.append("size", selectedSize);

    fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: cartData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data?.message || "Failed to add to cart.");
          });
        }
        setCartOpen(true);
        addProduct({
          id,
          name: product.name,
          price: product.price,
          cover_image: product.cover_image,
          images: product.images,
          available_colors: product.available_colors,
          color: selectedColor,
          size: selectedSize,
          quantity,
        });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to add to cart.");
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      <div className="product-container">
        <p className="page-title">Listing / Product</p>
        <form className="product-content" onSubmit={(e) => addToCart(e)}>
          <div className="pictures">
            <div className="mini-pics-list">
              {product && product.images
                ? product.images.map((img, idx) => (
                    <img
                      key={idx}
                      className="mini-pic"
                      src={img}
                      alt={`mini-${idx}`}
                      onClick={() => {
                        if (mainImage !== img) {
                          setImageTransitioning(true);
                          setTimeout(() => {
                            setMainImage(img);
                            setTimeout(() => {
                              setImageTransitioning(false);
                            }, 50);
                          }, 150);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ))
                : Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="shimmer shimmer-mini-pic" />)}
            </div>
            {mainImage ? (
              <img
                className={`main-pic ${imageTransitioning ? "transitioning" : ""}`}
                src={mainImage}
                alt={product ? product.name : "main"}
                style={{
                  opacity: imageTransitioning ? 0.3 : 1,
                }}
              />
            ) : (
              <div className="shimmer shimmer-main-pic" />
            )}
          </div>
          <div className="info">
            <header className="info-header">
              {product && product.name ? <h1 className="name">{product.name}</h1> : <div className="shimmer shimmer-name" />}
              {product && product.price ? <h1 className="price">$ {product.price}</h1> : <div className="shimmer shimmer-price" />}
            </header>

            <div className="options">
              <div className={`colors ${colorInvalid ? "invalid" : ""}`}>
                <p>Color: {selectedColor ? selectedColor : "Select color"}</p>
                <div className="available-colors">
                  {product && product.available_colors
                    ? product.available_colors.map((color, idx) => (
                        <button
                          type="button"
                          key={idx}
                          style={{}}
                          onClick={() => {
                            setSelectedColor(color);
                            const colorImage = getColorImage(product.images, product.available_colors, color);
                            if (colorImage && colorImage !== mainImage) {
                              setImageTransitioning(true);
                              setTimeout(() => {
                                setMainImage(colorImage);
                                setTimeout(() => {
                                  setImageTransitioning(false);
                                }, 50);
                              }, 150);
                            }
                          }}
                          className={selectedColor === color ? "selected" : ""}
                        >
                          <span style={{ backgroundColor: color }}></span>
                        </button>
                      ))
                    : Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="shimmer shimmer-color" />)}
                </div>
              </div>

              <div className={`sizes ${sizeInvalid ? "invalid" : ""}`}>
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

            <button className={`submit ${shake ? "shake" : ""}`} type="submit" disabled={product === null || loading} style={{ opacity: loading ? 0.6 : 1 }}>
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
    </>
  );
}

export default Product;
