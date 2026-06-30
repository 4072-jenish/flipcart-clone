import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "./ProductCard";
import { fetchProductsAsync } from "../Service/Actions/productActions";
import { FiPackage } from "react-icons/fi";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const filtered = useSelector((s) => s.products.filtered);
  const all = useSelector((s) => s.products.all);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await dispatch(fetchProductsAsync());
      setLoading(false);
    };
    load();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fz-spinner-wrap" data-testid="grid-loading">
        <div className="fz-spinner" />
      </div>
    );
  }

  return (
    <section className="fz-container" data-testid="product-grid">
      <ToastContainer position="bottom-right" autoClose={2200} hideProgressBar={false} closeOnClick newestOnTop />

      <div className="fz-grid-header">
        <div>
          <span className="section-eyebrow">The Edit</span>
          <h2 style={{ marginTop: 14 }}>
            Considered <em>commerce.</em>
          </h2>
          <p>Hand-picked products from craftspeople and makers we trust. Browse, save, and shop with intent.</p>
        </div>
        <div className="fz-result-count" data-testid="result-count">
          Showing {filtered.length} / {all.length} items
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="fz-empty" data-testid="empty-products">
          <span className="fz-empty-icon">
            <FiPackage />
          </span>
          <h3>No matches found</h3>
          <p>Try a different category or clear your filters to see all products.</p>
        </div>
      ) : (
        <div className="fz-grid">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
