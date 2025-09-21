import "./Product.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import arrow from "../../assets/arrow.svg";
import cartIcon from "../../assets/cartIcon.svg";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetch(`https://api.redseam.redberryinternship.ge/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="product-container">
      <p className="page-title">Listing / Product</p>
      <div className="product-content">
        <div className="pictures">
          <div className="mini-pics-list">{product ? product.images.map((img, idx) => <img key={idx} className="mini-pic" src={img} />) : Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="shimmer shimmer-mini-pic" />)}</div>
          {product ? <img className="main-pic" src={product.cover_image} alt={product.name} /> : <div className="shimmer shimmer-main-pic" />}
        </div>
        <div className="info">
          <header className="info-header">
            {product ? <h1 className="name">{product.name}</h1> : <div className="shimmer shimmer-name" />}
            {product ? <h1 className="price">$ {product.price}</h1> : <div className="shimmer shimmer-price" />}
          </header>

          <div className="options">
            <div className="colors">
              <p>Color: {selectedColor ? selectedColor : "Select color"}</p>
              <div className="available-colors">
                {product
                  ? product.available_colors.map((color, idx) => (
                      <button key={idx} style={{}} onClick={() => setSelectedColor(color)} className={selectedColor === color ? "selected" : ""}>
                        <span style={{ backgroundColor: color }}></span>
                      </button>
                    ))
                  : Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="shimmer shimmer-color" />)}
              </div>
            </div>

            <div className="sizes">
              <p>Size: {selectedSize ? selectedSize : "Select size"}</p>
              <div className="available-sizes">
                {product
                  ? product.available_sizes.map((size, idx) => (
                      <button key={idx} onClick={() => setSelectedSize(size)} className={selectedSize === size ? "selected" : ""}>
                        <p>{size}</p>
                      </button>
                    ))
                  : Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="shimmer shimmer-size" />)}
              </div>
            </div>

            <div className="quantity">
              <p>Quantity</p>
              <button disabled={product === null}>
                <span>1</span>
                <img src={arrow} />
              </button>
            </div>
          </div>

          <button className="submit" disabled={product === null}>
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
              {product ? <p className="brand">Brand: {product.brand.name}</p> : <div className="shimmer shimmer-brand" />}
              {product ? <p className="description">{product.description}</p> : <div className="shimmer shimmer-description" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
