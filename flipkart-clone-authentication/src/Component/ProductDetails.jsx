import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft, FiShoppingBag, FiCheck, FiStar, FiTruck, FiShield, FiRefreshCw, FiPackage } from "react-icons/fi";
import { addToCartAsync } from "../Service/Actions/cartActions";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const allProducts = useSelector((s) => s.products.all);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedThumb, setSelectedThumb] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const local = allProducts.find((p) => String(p.id) === String(id));
        if (local) {
          setProduct(local);
          setLoading(false);
          return;
        }
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          toast.error("Product not found");
          setTimeout(() => navigate("/"), 1500);
        }
      } catch {
        toast.error("Could not load product");
        setTimeout(() => navigate("/"), 1500);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, allProducts]);

  const handleAdd = () => {
    if (!user) {
      toast.info("Sign in to add to cart");
      return setTimeout(() => navigate("/signin"), 800);
    }
    dispatch(addToCartAsync(product));
    toast.success("Added to cart");
  };

  const handleBuy = () => {
    if (!user) {
      toast.info("Sign in to continue");
      return setTimeout(() => navigate("/signin"), 800);
    }
    dispatch(addToCartAsync(product));
    setTimeout(() => navigate("/cart"), 400);
  };

  if (loading) {
    return (
      <div className="fz-spinner-wrap" data-testid="pd-loading">
        <div className="fz-spinner" />
      </div>
    );
  }
  if (!product) return null;

  const rating = typeof product.rating === "object" ? product.rating?.rate : product.rating || 4.5;
  const features = [
    { icon: <FiTruck size={16} />, label: "Free shipping over ₹999" },
    { icon: <FiShield size={16} />, label: "Secure payment" },
    { icon: <FiRefreshCw size={16} />, label: "7-day easy returns" },
    { icon: <FiPackage size={16} />, label: "Quality verified" },
  ];

  return (
    <section className="fz-container fz-pd" data-testid="product-details">
      <ToastContainer position="bottom-right" autoClose={2200} />
      <motion.button
        className="fz-pd-back"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        data-testid="pd-back"
      >
        <FiArrowLeft size={14} /> Back
      </motion.button>

      <div className="fz-pd-grid">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.div className="fz-pd-image" layoutId={`img-${product.id}`}>
            <img src={product.image} alt={product.name} onError={(e) => (e.currentTarget.src = "https://placehold.co/800/EDE7DD/0F0F0F?text=No+Image")} />
          </motion.div>
          <div className="fz-pd-thumbs">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className="fz-pd-thumb"
                data-active={selectedThumb === i}
                onClick={() => setSelectedThumb(i)}
                data-testid={`pd-thumb-${i}`}
              >
                <img src={product.image} alt={`view ${i + 1}`} />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="fz-pd-cat" data-testid="pd-category">{product.category}</span>
          <h1 className="fz-pd-title" data-testid="pd-name">{product.name}</h1>

          <div className="fz-pd-meta-row">
            <div className="fz-pd-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={15} fill={i < Math.round(rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span>{rating} · 240 reviews</span>
            <span style={{ color: "var(--success)" }}>In Stock</span>
          </div>

          <div>
            <div className="fz-pd-price" data-testid="pd-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>
            <div className="fz-pd-price-tax">Inclusive of all taxes</div>
          </div>

          <div className="fz-pd-section">
            <h5>About</h5>
            <p className="fz-pd-desc" data-testid="pd-description">{product.description || "A considered piece, crafted with intent."}</p>
          </div>

          <div className="fz-pd-section">
            <h5>Why you'll like it</h5>
            <ul className="fz-pd-features">
              {features.map((f, i) => (
                <li key={i}>{f.icon}{f.label}</li>
              ))}
            </ul>
          </div>

          <div className="fz-pd-cta">
            <button className="fz-btn fz-btn-ghost" onClick={handleAdd} data-testid="pd-add-to-cart">
              <FiShoppingBag size={16} /> Add to Cart
            </button>
            <button className="fz-btn fz-btn-accent" onClick={handleBuy} data-testid="pd-buy-now">
              <FiCheck size={16} /> Buy Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetails;
