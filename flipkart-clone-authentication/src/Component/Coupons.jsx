import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTag, FaCopy, FaGift, FaPercent } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    setCoupons([
      { 
        code: "WELCOME10", 
        discount: "10% OFF", 
        description: "Get 10% off on your first order",
        minOrder: "₹500",
        expiry: "2024-12-31",
        color: "primary"
      },
      { 
        code: "FREESHIP", 
        discount: "Free Shipping", 
        description: "Free shipping on all orders",
        minOrder: "No minimum",
        expiry: "2024-12-31",
        color: "secondary"
      },
      { 
        code: "SAVE20", 
        discount: "20% OFF", 
        description: "Special discount on electronics",
        minOrder: "₹1000",
        expiry: "2024-11-30",
        color: "success"
      },
      { 
        code: "FLIP200", 
        discount: "₹200 OFF", 
        description: "Flat ₹200 off on orders above ₹999",
        minOrder: "₹999",
        expiry: "2024-12-15",
        color: "warning"
      }
    ]);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`✨ Copied ${code} to clipboard!`);
  };

  const getGradient = (color) => {
    const gradients = {
      primary: "linear-gradient(135deg, #00b4db, #0083b0)",
      secondary: "linear-gradient(135deg, #667eea, #764ba2)",
      success: "linear-gradient(135deg, #84fab0, #8fd3f4)",
      warning: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    };
    return gradients[color] || gradients.primary;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-5"
    >
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      
      <div className="cart-header mb-5">
        <h2 className="fw-bold mb-0">
          <FaTag className="me-3" style={{ color: 'var(--primary-color)' }} />
          Your Coupons
        </h2>
        <p className="text-muted mb-0">Available coupons and offers</p>
      </div>

      {coupons.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="empty-state"
        >
          <FaGift className="empty-state-icon" />
          <h3 className="empty-state-title">No Coupons Available</h3>
          <p className="empty-state-text">Check back later for new offers!</p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="row g-4"
        >
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.code}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 100 }
                }
              }}
              className="col-md-6 col-lg-3"
            >
              <div
                className="coupon-card"
                style={{ background: getGradient(coupon.color) }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <FaPercent size={30} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-light btn-sm rounded-pill"
                    onClick={() => copyToClipboard(coupon.code)}
                  >
                    <FaCopy className="me-1" /> Copy
                  </motion.button>
                </div>
                
                <div className="coupon-code">{coupon.code}</div>
                <div className="coupon-discount">{coupon.discount}</div>
                
                <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                
                <p className="small mb-1">{coupon.description}</p>
                <div className="d-flex justify-content-between mt-3 small">
                  <span>Min. Order: {coupon.minOrder}</span>
                  <span>Expires: {new Date(coupon.expiry).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Coupons;