import "./ProductsList.css";

import filterIcon from "../../assets/filterIcon.svg";
import arrow from "../../assets/arrow.svg";

import { useEffect, useState } from "react";

function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://api.redseam.redberryinternship.ge/api/products", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="products-list">
      <header>
        <h1>Products</h1>

        <div className="controls">
          <p className="results">Showing 1–10 of 100 results</p>
          <span className="line"></span>
          <div className="filter">
            <img src={filterIcon} alt="Filter" />
            <p>Filter</p>
          </div>
          <div className="sort">
            <p>Sort by</p>
            <div>
              <img src={arrow} alt="Sort" />
            </div>
          </div>
        </div>
      </header>

      <div className="products">
        {products.data &&
          products.data.map((product) => (
            <div className="product" key={product.id}>
              <img src={product.cover_image} alt={product.name} />
              <div className="description">
                <p className="name">{product.name}</p>
                <p className="price">{product.price ? `$ ${product.price}` : ""}</p>
              </div>
            </div>
          ))}
      </div>

      <div className="pagination">
        <button className="previous">
          <img src={arrow} alt="Previous" />
        </button>

        <button><p>1</p></button>
        <button><p>2</p></button>
        <button><p>...</p></button>
        <button><p>9</p></button>
        <button><p>10</p></button>

        <button className="next">
          <img src={arrow} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default ProductsList;
