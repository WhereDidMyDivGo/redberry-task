import "./ProductsList.css";

import filterIcon from "../../assets/filterIcon.svg";
import arrow from "../../assets/arrow.svg";

import { useEffect, useState } from "react";

function ProductsList() {
  const [products, setProducts] = useState({ data: [], meta: {}, links: {} });
  const [loading, setLoading] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const buildQuery = (params) => {
    return Object.keys(params)
      .filter((k) => params[k] !== undefined && params[k] !== "")
      .map((k) => `${k}=${params[k]}`)
      .join("&");
  };

  const fetchProducts = (page, filters) => {
    setLoading(true);
    const params = { page };
    if (filters.price_from) params["filter[price_from]"] = filters.price_from;
    if (filters.price_to) params["filter[price_to]"] = filters.price_to;
    const query = buildQuery(params);
    const url = `https://api.redseam.redberryinternship.ge/api/products?${query}`;

    const urlParams = new URLSearchParams();
    urlParams.set("page", page);
    if (filters.price_from) urlParams.set("price_from", filters.price_from);
    if (filters.price_to) urlParams.set("price_to", filters.price_to);
    window.history.replaceState(null, "", `?${urlParams.toString()}`);

    fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    const price_from = params.get("price_from") || "";
    const price_to = params.get("price_to") || "";
    setFilterFrom(price_from);
    setFilterTo(price_to);
    fetchProducts(page, { price_from, price_to });
  }, []);

  const handleFilterClick = (e) => {
    const modal = document.querySelector(".filter-modal");
    if (modal.contains(e.target)) return;

    if (modal.style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  const blockInvalidKeys = (e) => {
    if (e.key === "-" || e.key === "+" || e.key === "e") e.preventDefault();
  };

  const handleFrom = (e) => setFilterFrom(e.target.value);
  const handleTo = (e) => setFilterTo(e.target.value);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchProducts(1, { price_from: filterFrom, price_to: filterTo });
    const modal = document.querySelector(".filter-modal");
    if (modal) modal.style.display = "none";
  };

  return (
    <div className="products-list">
      <header>
        <h1>Products</h1>

        <div className="controls">
          <p className="results">
            {products.meta?.from || 0}–{products.meta?.to || 0} of {products.meta?.total || 0} results
          </p>
          <span className="line"></span>
          <div className="filter" onClick={(e) => handleFilterClick(e)}>
            <div className="icon">
              <img src={filterIcon} alt="Filter" />
            </div>
            <p>Filter</p>
            <form className="filter-modal" onSubmit={handleFilter}>
              <h2>Select price</h2>
              <div className="filter-controls">
                <div className="inputs">
                  <label htmlFor="filter-from">
                    <input id="filter-from" type="number" placeholder="From *" min="0" required value={filterFrom} onChange={handleFrom} onKeyDown={blockInvalidKeys} />
                  </label>
                  <label htmlFor="filter-to">
                    <input id="filter-to" type="number" placeholder="To *" min="0" required value={filterTo} onChange={handleTo} onKeyDown={blockInvalidKeys} />
                  </label>
                </div>

                <button className="submit" type="submit">
                  <p>Apply</p>
                </button>
              </div>
            </form>
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
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => (
              <div className="product" key={"shimmer-" + idx}>
                <div className="shimmer-img shimmer" />
                <div className="description">
                  <div className="shimmer-name shimmer" />
                  <div className="shimmer-price shimmer" />
                </div>
              </div>
            ))
          : products.data &&
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
        <button
          className="previous"
          onClick={() => {
            if (products.meta?.current_page > 1) fetchProducts(products.meta.current_page - 1, { price_from: filterFrom, price_to: filterTo });
          }}
          disabled={products.meta?.current_page === 1}
        >
          <img src={arrow} alt="Previous" />
        </button>

        {(() => {
          const total = products.meta?.last_page || 1;
          const current = products.meta?.current_page || 1;
          const pages = [];
          for (let i = 1; i <= total; i++) {
            if (i === 1 || i === 2 || i === total || i === total - 1 || Math.abs(i - current) <= 1) {
              pages.push(i);
            }
          }
          const uniquePages = Array.from(new Set(pages)).sort((a, b) => a - b);
          let last = 0;
          const pageButtons = [];
          uniquePages.forEach((page, idx) => {
            if (page - last > 1) {
              pageButtons.push(
                <button key={"ellipsis-" + page + "-" + last} disabled style={{ background: "none", cursor: "default" }}>
                  <p>...</p>
                </button>
              );
            }
            pageButtons.push(
              <button key={page} className={page === current ? "active" : ""} onClick={() => fetchProducts(page, { price_from: filterFrom, price_to: filterTo })} disabled={page === current}>
                <p>{page}</p>
              </button>
            );
            last = page;
          });
          return pageButtons;
        })()}

        <button
          className="next"
          onClick={() => {
            if (products.meta?.current_page < products.meta?.last_page) fetchProducts(products.meta.current_page + 1, { price_from: filterFrom, price_to: filterTo });
          }}
          disabled={products.meta?.current_page === products.meta?.last_page}
        >
          <img src={arrow} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default ProductsList;
