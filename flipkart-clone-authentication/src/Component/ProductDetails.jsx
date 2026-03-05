import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { FaShoppingBag, FaArrowLeft, FaStar, FaBox } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container my-5"
    >
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5 }}
        className="btn btn-link text-decoration-none mb-4"
        onClick={() => navigate(-1)}
        style={{ color: "#00b4db" }}
      >
        <FaArrowLeft className="me-2" />
        Back to Products
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card border-0 rounded-4 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #ffffff, #f8faff)",
          boxShadow: "0 20px 40px -12px rgba(0, 119, 182, 0.25)"
        }}
      >
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-md-6 p-4 p-lg-5">
            <div className="position-relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-light rounded-4 p-4 mb-3"
                style={{ minHeight: "400px" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid"
                  style={{ 
                    maxHeight: "350px", 
                    objectFit: "contain",
                    mixBlendMode: "multiply"
                  }}
                />
              </motion.div>
              
              {/* Thumbnails */}
              <div className="d-flex gap-2 mt-3">
                {[1, 2, 3].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-light rounded-3 p-2 cursor-pointer ${
                      selectedImage === index ? "border border-primary" : ""
                    }`}
                    style={{ 
                      width: "70px", 
                      height: "70px",
                      border: selectedImage === index ? "2px solid #00b4db" : "none"
                    }}
                  >
                    <img
                      src={product.image}
                      alt={`thumbnail-${index}`}
                      className="img-fluid h-100 w-100"
                      style={{ objectFit: "contain" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="col-md-6 p-4 p-lg-5 bg-white">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4">
                <span className="badge bg-primary mb-3 px-3 py-2" style={{ 
                  background: "linear-gradient(135deg, #00b4db, #0083b0)",
                  fontSize: "0.8rem"
                }}>
                  {product.category}
                </span>
                <h1 className="display-5 fw-bold mb-3" style={{ color: "#1e293b" }}>
                  {product.name}
                </h1>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className="me-1"
                      color={star <= Math.round(product.rating?.rate || 4) ? "#fbbf24" : "#e2e8f0"}
                    />
                  ))}
                </div>
                <span className="text-muted">
                  ({product.rating?.count || 99} reviews)
                </span>
              </div>

              <div className="mb-4">
                <h2 className="display-6 fw-bold" style={{
                  background: "linear-gradient(135deg, #00b4db, #0083b0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  ₹{product.price}
                </h2>
                <p className="text-success small">inclusive of all taxes</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Description</h5>
                <p className="text-muted lead" style={{ fontSize: "1rem", lineHeight: "1.7" }}>
                  {product.description}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Key Features</h5>
                <ul className="list-unstyled">
                  {["Premium Quality", "Fast Delivery", "Secure Payment", "24/7 Support"].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="mb-2"
                    >
                      <span className="text-success me-2">✓</span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="d-grid gap-2"
              >
                <button
                  className="btn btn-lg py-3 rounded-pill"
                  style={{
                    background: "linear-gradient(135deg, #00b4db, #0083b0)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 10px 20px rgba(0, 180, 219, 0.3)"
                  }}
                >
                  <FaShoppingBag className="me-2" />
                  Add to Cart
                </button>
                
                <button
                  className="btn btn-outline-primary btn-lg py-3 rounded-pill"
                  style={{
                    border: "2px solid #00b4db",
                    color: "#00b4db"
                  }}
                >
                  <FaBox className="me-2" />
                  Buy Now
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;