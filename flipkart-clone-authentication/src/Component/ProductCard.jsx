import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiHeart, FiShoppingBag, FiEye, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { addToCartAsync } from "../Service/Actions/cartActions";
import { deleteProductAsync } from "../Service/Actions/productActions";

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Sign in to add items to your cart");
      setTimeout(() => navigate("/signin"), 800);
      return;
    }
    dispatch(addToCartAsync(product));
    toast.success("Added to cart");
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((v) => !v);
    toast.success(liked ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this product?")) return;
    try {
      await dispatch(deleteProductAsync(product.id));
      toast.success("Product deleted");
    } catch {
      toast.error("Could not delete");
    }
  };

  const rating = typeof product.rating === "object" ? product.rating?.rate : product.rating;

  return (
    <motion.article
      className="fz-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/product/${product.id}`)}
      data-testid={`product-card-${product.id}`}
    >
      <div className="fz-card-img-wrap">
        {product.category && (
          <span className="fz-card-badge" data-testid="product-card-category">
            {product.category}
          </span>
        )}
        <button
          className="fz-card-fav"
          data-active={liked}
          onClick={handleLike}
          data-testid="product-card-favorite"
          aria-label="Add to wishlist"
        >
          <FiHeart size={15} fill={liked ? "currentColor" : "none"} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="fz-card-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x600/EDE7DD/0F0F0F?text=No+Image";
          }}
        />

        <div className="fz-card-quick-actions">
          <button
            className="fz-card-quick-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            data-testid="product-card-view"
          >
            <FiEye size={14} /> Quick View
          </button>
          <button
            className="fz-card-quick-btn icon-only"
            onClick={handleAddToCart}
            data-testid="product-card-add"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={14} />
          </button>
          {user && (
            <>
              <button
                className="fz-card-quick-btn icon-only"
                onClick={(e) => { e.stopPropagation(); navigate(`/edit/${product.id}`); }}
                data-testid="product-card-edit"
                aria-label="Edit"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                className="fz-card-quick-btn icon-only danger"
                onClick={handleDelete}
                data-testid="product-card-delete"
                aria-label="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="fz-card-meta">
        <div className="fz-card-row">
          <span className="fz-card-cat">{product.category || "—"}</span>
          <span className="fz-card-rate">
            <FiStar size={11} fill="currentColor" /> {rating || "4.5"}
          </span>
        </div>
        <h6 className="fz-card-name" data-testid="product-card-name">
          {product.name}
        </h6>
        <div className="fz-card-price" data-testid="product-card-price">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
