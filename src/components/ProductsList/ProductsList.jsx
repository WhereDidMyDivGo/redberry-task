import "./ProductsList.css";

import filterIcon from "../../assets/filterIcon.svg";
import arrow from "../../assets/arrow.svg";
import xIcon from "../../assets/xIcon.svg";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ProductsList() {
  const location = useLocation();
  const [products, setProducts] = useState({ data: [], meta: {}, links: {} });
  const [loading, setLoading] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const fetchProducts = (page, filters, sort) => {
    setLoading(true);
    const apiParams = new URLSearchParams();
    apiParams.set("page", page);
    if (filters.price_from) apiParams.set("filter[price_from]", filters.price_from);
    if (filters.price_to) apiParams.set("filter[price_to]", filters.price_to);
    if (sort) apiParams.set("sort", sort);
    const url = `https://api.redseam.redberryinternship.ge/api/products?${apiParams.toString()}`;

    const urlParams = new URLSearchParams();
    urlParams.set("page", page);
    if (filters.price_from) urlParams.set("price_from", filters.price_from);
    if (filters.price_to) urlParams.set("price_to", filters.price_to);
    if (sort) urlParams.set("sort", sort);
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
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const price_from = params.get("price_from") || "";
    const price_to = params.get("price_to") || "";
    const sort = params.get("sort") || "";
    setFilterFrom(price_from);
    setFilterTo(price_to);
    setSortBy(sort);
    fetchProducts(page, { price_from, price_to }, sort);
  }, [location.key]);

  const toggleFilterModal = () => {
    setIsSortModalOpen(false);
    setIsFilterModalOpen((prev) => !prev);
  };

  const toggleSortModal = () => {
    setIsFilterModalOpen(false);
    setIsSortModalOpen((prev) => !prev);
  };

  const blockInvalidKeys = (e) => {
    if (e.key === "-" || e.key === "+" || e.key === "e") e.preventDefault();
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProducts(1, { price_from: filterFrom, price_to: filterTo });
    setIsFilterModalOpen(false);
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    fetchProducts(1, { price_from: filterFrom, price_to: filterTo }, sortValue);
    setIsSortModalOpen(false);
  };

  const clearSort = () => {
    setSortBy("");
    fetchProducts(1, { price_from: filterFrom, price_to: filterTo }, "");
    setIsSortModalOpen(false);
  };

  const getFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      price_from: params.get("price_from") || "",
      price_to: params.get("price_to") || "",
    };
  };

  const clearFilters = () => {
    setFilterFrom("");
    setFilterTo("");
    const params = new URLSearchParams(window.location.search);
    params.delete("price_from");
    params.delete("price_to");
    params.set("page", 1);
    window.history.replaceState(null, "", `?${params.toString()}`);
    fetchProducts(1, { price_from: "", price_to: "" }, params.get("sort") || sortBy);
    setIsFilterModalOpen(false);
    setIsSortModalOpen(false);
  };

  const filtersInUrl = () => {
    const { price_from, price_to } = getFiltersFromUrl();
    return price_from !== "" || price_to !== "";
  };

  const getSortLabel = () => {
    if (sortBy === "created_at") return "New products first";
    if (sortBy === "price") return "Price, low to high";
    if (sortBy === "-price") return "Price, high to low";
    return "Sort by";
  };

  return (
    <div className="products-list">
      <header>
        <h1>Products</h1>

        <div className="controls">
          <p className="results">
            {products.meta.from || 0}–{products.meta.to || 0} of {products.meta.total || 0} results
          </p>
          <span className="line"></span>
          <div className="filter" onClick={toggleFilterModal}>
            <div className="filter-icon">
              <img src={filterIcon} alt="Filter" />
            </div>
            <p>Filter</p>
            <form className="filter-modal" onSubmit={handleFilter} onClick={(e) => e.stopPropagation()} style={{ display: isFilterModalOpen ? "flex" : "none" }}>
              <h2>Select price</h2>
              <div className="filter-controls">
                <div className="inputs">
                  <label htmlFor="filter-from">
                    <input id="filter-from" type="number" placeholder="From *" min="0" required value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} onKeyDown={blockInvalidKeys} />
                  </label>
                  <label htmlFor="filter-to">
                    <input id="filter-to" type="number" placeholder="To *" min="0" required value={filterTo} onChange={(e) => setFilterTo(e.target.value)} onKeyDown={blockInvalidKeys} />
                  </label>
                </div>

                <button className="submit" type="submit">
                  <p>Apply</p>
                </button>
              </div>
            </form>
          </div>
          <div className="sort" onClick={toggleSortModal}>
            <p>{getSortLabel()}</p>
            <div className="sort-icon">
              <img className="sort-arrow" src={arrow} alt="Sort" style={{ transform: isSortModalOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </div>

            <form className="sort-modal" onClick={(e) => e.stopPropagation()} style={{ display: isSortModalOpen ? "flex" : "none" }}>
              <h2>Sort by</h2>
              <div className="sort-options">
                <button type="button" onClick={() => handleSort("created_at")} className={sortBy === "created_at" ? "active" : ""} disabled={sortBy === "created_at"}>
                  <p>New products first</p>
                </button>
                <button type="button" onClick={() => handleSort("price")} className={sortBy === "price" ? "active" : ""} disabled={sortBy === "price"}>
                  <p>Price, low to high</p>
                </button>
                <button type="button" onClick={() => handleSort("-price")} className={sortBy === "-price" ? "active" : ""} disabled={sortBy === "-price"}>
                  <p>Price, high to low</p>
                </button>
              </div>
              {sortBy && (
                <button className="clear-sort" type="button" onClick={clearSort}>
                  <p>Clear Sort</p>
                </button>
              )}
            </form>
          </div>
        </div>
      </header>

      {filtersInUrl() && (
        <div className="filters">
          <p>{`Price: ${getFiltersFromUrl().price_from}-${getFiltersFromUrl().price_to}`}</p>
          <button className="clear-filters" onClick={clearFilters}>
            <img src={xIcon} alt="Clear filters" />
          </button>
        </div>
      )}

      <div className={`products${filtersInUrl() ? " includes-filters" : ""}`}>
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
            if (products.meta.current_page > 1) fetchProducts(products.meta.current_page - 1, getFiltersFromUrl());
          }}
          disabled={products.meta.current_page === 1}
        >
          <img src={arrow} alt="Previous" />
        </button>

        {(() => {
          const total = products.meta.last_page || 1;
          const current = products.meta.current_page || 1;
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
                <button key={"ellipsis-" + page + "-" + last} disabled style={{}}>
                  <p>...</p>
                </button>
              );
            }
            pageButtons.push(
              <button key={page} className={page === current ? "active" : ""} onClick={() => fetchProducts(page, getFiltersFromUrl())} disabled={page === current}>
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
            if (products.meta.current_page < products.meta.last_page) fetchProducts(products.meta.current_page + 1, getFiltersFromUrl());
          }}
          disabled={products.meta.current_page === products.meta.last_page}
        >
          <img src={arrow} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default ProductsList;
