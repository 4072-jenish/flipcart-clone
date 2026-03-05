import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaIdCard, FaCalendar, FaShoppingBag, FaHeart, FaTag } from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-5"
      >
        <div className="empty-state">
          <FaUserCircle className="empty-state-icon" />
          <h3 className="empty-state-title">Please Sign In</h3>
          <p className="empty-state-text">You need to be logged in to view your profile</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient mt-4 px-5 py-3"
            onClick={() => window.location.href = "/signin"}
          >
            Go to Sign In
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const stats = [
    { icon: <FaShoppingBag />, label: "Orders", value: "12" },
    { icon: <FaHeart />, label: "Wishlist", value: "8" },
    { icon: <FaTag />, label: "Coupons", value: "3" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-5"
    >
      <div className="row g-4">
        <div className="col-lg-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="profile-card"
          >
            <div className="profile-avatar">
              <FaUserCircle />
            </div>
            
            <h3 className="fw-bold mt-3">{user.email?.split("@")[0]}</h3>
            <p className="text-muted">Member since 2024</p>
            
            <div className="d-flex justify-content-center gap-3 mt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="text-center"
                >
                  <div className="fs-4" style={{ color: 'var(--primary-color)' }}>
                    {stat.icon}
                  </div>
                  <div className="fw-bold">{stat.value}</div>
                  <small className="text-muted">{stat.label}</small>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="col-lg-8">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="form-modern"
          >
            <h4 className="fw-bold mb-4">Profile Information</h4>
            
            <div className="mb-4">
              <label className="form-label">
                <FaEnvelope className="me-2" style={{ color: 'var(--primary-color)' }} />
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                value={user.email}
                readOnly
                disabled
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                <FaIdCard className="me-2" style={{ color: 'var(--primary-color)' }} />
                User ID
              </label>
              <input
                type="text"
                className="form-control"
                value={user.uid}
                readOnly
                disabled
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                <FaCalendar className="me-2" style={{ color: 'var(--primary-color)' }} />
                Account Created
              </label>
              <input
                type="text"
                className="form-control"
                value={new Date(user.metadata?.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                readOnly
                disabled
              />
            </div>

            <hr className="my-4" />

            <div className="d-flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline-gradient flex-grow-1"
                onClick={() => window.location.href = "/orders"}
              >
                View Orders
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline-gradient flex-grow-1"
                onClick={() => window.location.href = "/wishlist"}
              >
                Wishlist
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;