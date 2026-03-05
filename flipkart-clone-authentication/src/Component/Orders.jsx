import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory, FaBox, FaRupeeSign, FaCalendar } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const Orders = () => {
  const orders = useSelector((state) => state.orders);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const orderVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-5"
      >
        <div className="empty-state">
          <FaHistory className="empty-state-icon" />
          <h3 className="empty-state-title">No Orders Yet</h3>
          <p className="empty-state-text">Looks like you haven't placed any orders</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gradient mt-4 px-5 py-3"
            onClick={() => window.location.href = "/"}
          >
            Start Shopping
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-5"
    >
      <div className="cart-header mb-5">
        <h2 className="fw-bold mb-0">
          <FaHistory className="me-3" style={{ color: 'var(--primary-color)' }} />
          Order History
        </h2>
        <p className="text-muted mb-0">You have placed {orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="row g-4"
      >
        <AnimatePresence>
          {orders.slice().reverse().map((order, index) => (
            <motion.div
              key={order.id || index}
              variants={orderVariants}
              exit={{ opacity: 0, x: -20 }}
              className="col-12"
            >
              <div className="order-card">
                <div className="order-header">
                  <div className="d-flex align-items-center gap-4">
                    <span className="fw-bold">Order #{orders.length - index}</span>
                    <span className="text-muted">
                      <FaCalendar className="me-2" />
                      {new Date(order.id).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className="badge" style={{ background: 'var(--success-gradient)' }}>
                    <MdLocalShipping className="me-1" />
                    Delivered
                  </span>
                </div>

                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-semibold mb-1">{item.name}</h6>
                          <span className="badge bg-light text-dark">{item.category}</span>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                            ₹{item.price * (item.quantity || 1)}
                          </span>
                          <div className="text-muted small">
                            ₹{item.price} × {item.quantity || 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Items: {order.items.length}</span>
                  <span className="h5 fw-bold mb-0">
                    Total: <span style={{ color: 'var(--primary-color)' }}>₹{order.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Orders;