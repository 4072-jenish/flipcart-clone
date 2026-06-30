import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiTruck } from "react-icons/fi";

const Orders = () => {
  const orders = useSelector((s) => s.orders) || [];
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <section className="fz-container fz-page">
        <div className="fz-empty" data-testid="orders-empty">
          <span className="fz-empty-icon"><FiPackage /></span>
          <h3>No orders yet</h3>
          <p>When you place an order, it'll show up here.</p>
          <button className="fz-btn" onClick={() => navigate("/")} data-testid="orders-shop-cta">
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="fz-container fz-page" data-testid="orders-page">
      <div className="fz-page-h">
        <div>
          <span className="section-eyebrow">{orders.length} order{orders.length > 1 ? "s" : ""}</span>
          <h1 style={{ marginTop: 12 }}>Order History</h1>
          <p>Everything you've ever bought, in one place.</p>
        </div>
      </div>

      <AnimatePresence>
        {orders.slice().reverse().map((order, index) => {
          const orderTotal = order.items.reduce((s, i) => s + Number(i.price) * (i.quantity || 1), 0);
          return (
            <motion.div
              key={order.id}
              className="fz-order-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              data-testid={`order-${order.id}`}
            >
              <div className="fz-order-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span className="fz-order-id">Order #{orders.length - index}</span>
                  <span className="fz-order-date">{new Date(order.id).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
                <span className="fz-status"><FiTruck style={{ marginRight: 4 }} size={11} /> Delivered</span>
              </div>

              {order.items.map((item) => (
                <div className="fz-order-line" key={item.id}>
                  <img src={item.image} alt={item.name} onError={(e) => (e.currentTarget.src = "https://placehold.co/120/EDE7DD/0F0F0F?text=No+Image")} />
                  <div style={{ flex: 1 }}>
                    <h6>{item.name}</h6>
                    <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>
                      ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}
                    </div>
                    <small style={{ color: "var(--ink-3)", fontFamily: 'var(--font-mono)', fontSize: 11 }}>₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity || 1}</small>
                  </div>
                </div>
              ))}

              <div className="fz-order-foot">
                <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                <strong>₹{orderTotal.toLocaleString("en-IN")}</strong>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
};

export default Orders;
