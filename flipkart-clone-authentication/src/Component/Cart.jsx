import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCartAsync } from "../Service/Actions/cartActions";
import { useNavigate } from "react-router";
import './common.css';
import { toast, ToastContainer } from "react-toastify";
import { clearCart, placeOrder } from "../Service/Actions/orderActions";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaTrashAlt, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { MdRemoveShoppingCart } from "react-icons/md";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCartAsync(id));
    toast.info("Item removed from cart");
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleIncrease = (id) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  };

  const handleDecrease = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  const handleProceedOrder = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }
    dispatch(placeOrder(cart));
    dispatch(clearCart());
    toast.success("🎉 Order placed successfully!");
    setTimeout(() => navigate("/orders"), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="cart-container"
    >
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="cart-header d-flex justify-content-between align-items-center">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fw-bold mb-0"
          style={{ color: 'var(--text-dark)' }}
        >
          <FaShoppingBag className="me-3" style={{ color: 'var(--primary-color)' }} />
          Your Shopping Cart
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline-gradient"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </motion.button>
      </div>

      {cart.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="empty-state"
        >
          <MdRemoveShoppingCart className="empty-state-icon" />
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-text">Looks like you haven't added anything yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient mt-4 px-5 py-3"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="cart-item"
                  >
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      </div>
                      
                      <div className="col-md-5">
                        <h5 className="fw-semibold mb-2">{item.name}</h5>
                        <span className="badge bg-primary mb-2" style={{ background: 'var(--primary-gradient)' }}>
                          {item.category}
                        </span>
                        <p className="text-muted small mb-0">
                          {item.description?.substring(0, 60)}...
                        </p>
                      </div>
                      
                      <div className="col-md-3">
                        <div className="quantity-control">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="quantity-btn"
                            onClick={() => handleDecrease(item.id)}
                          >
                            <FaMinus size={12} />
                          </motion.button>
                          <span className="fw-bold">{item.quantity || 1}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="quantity-btn"
                            onClick={() => handleIncrease(item.id)}
                          >
                            <FaPlus size={12} />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="col-md-2 text-end">
                        <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>
                          ₹{item.price * (item.quantity || 1)}
                        </h5>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleRemove(item.id)}
                        >
                          <FaTrashAlt /> Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="cart-summary"
            >
              <h4 className="fw-bold mb-4">Order Summary</h4>
              
              {cart.map((item) => (
                <div key={item.id} className="cart-summary-item">
                  <span className="text-muted">{item.name} x{item.quantity || 1}</span>
                  <span className="fw-semibold">₹{item.price * (item.quantity || 1)}</span>
                </div>
              ))}
              
              <div className="cart-summary-item mt-3">
                <span className="fw-bold">Subtotal</span>
                <span className="fw-bold">₹{total}</span>
              </div>
              
              <div className="cart-summary-item">
                <span className="text-muted">Shipping</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 fw-bold">Total</span>
                <span className="h4 fw-bold" style={{ color: 'var(--primary-color)' }}>
                  ₹{total}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gradient w-100 py-3"
                onClick={handleProceedOrder}
              >
                Proceed to Checkout
              </motion.button>
              
              <p className="text-muted small text-center mt-3 mb-0">
                Secure payment • Free delivery • 7-day returns
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;