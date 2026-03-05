import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBag, FaRegHeart, FaHeart, FaEye, FaTrashAlt } from "react-icons/fa";
import { MdEdit, MdOutlineStar } from "react-icons/md";
import { addToCartAsync } from "../Service/Actions/cartActions";
import { deleteProductAsync } from "../Service/Actions/productActions";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./common.css";

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -8,
      transition: { duration: 0.3 }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning("✨ Please login to add items to cart");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }
    toast.success("🎉 Added to cart successfully!");
    dispatch(addToCartAsync(product));
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? "💔 Removed from wishlist" : "❤️ Added to wishlist");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
    
    try {
      await dispatch(deleteProductAsync(product.id));
      toast.success("✅ Product deleted successfully");
    } catch {
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
    >
      <ToastContainer position="bottom-right" autoClose={2000} />
      
      <div className="modern-card position-relative overflow-hidden">
        {/* Image Container with Shine Effect */}
        <div className="modern-card-image position-relative overflow-hidden">
          {!imageLoaded && (
            <div className="skeleton-loader position-absolute w-100 h-100" />
          )}
          
          <motion.img
            src={product.image}
            alt={product.name}
            className={`w-100 ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setImageLoaded(true)}
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Shine Effect */}
          <motion.div
            className="shine-effect"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '200%' } : { x: '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Category Badge */}
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="category-badge"
          >
            {product.category}
          </motion.span>

          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="like-button"
          >
            {isLiked ? (
              <FaHeart className="text-danger" />
            ) : (
              <FaRegHeart />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="modern-card-content">
          <motion.h6 
            className="product-title"
            title={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.name?.length > 40
              ? product.name.substring(0, 40) + "..."
              : product.name || "No name"}
          </motion.h6>

          <motion.div 
            className="d-flex justify-content-between align-items-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="product-price">
              ₹{product.price}
            </span>
            <span className="product-rating">
              <MdOutlineStar className="star-icon" />
              {product.rating?.rate || "4.5"} 
              <span className="rating-count">({product.rating?.count || "99"})</span>
            </span>
          </motion.div>

          {/* Description with animation */}
          <motion.p 
            className="product-description"
            initial={{ opacity: 0, height: 0 }}
            animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {product.description?.length > 60 
              ? product.description.substring(0, 60) + '...' 
              : product.description || "Amazing product with great features!"}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="action-buttons mt-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="d-flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-action view"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <FaEye /> Quick View
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-action cart"
                onClick={handleAddToCart}
              >
                <FaShoppingBag />
              </motion.button>

              {user && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-action edit"
                    onClick={() => navigate(`/edit/${product.id}`)}
                  >
                    <MdEdit />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-action delete"
                    onClick={handleDelete}
                  >
                    <FaTrashAlt />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Animation Elements */}
        {isHovered && (
          <>
            <motion.div
              className="floating-circle"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="floating-circle-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.1 }}
              transition={{ duration: 0.7 }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;