import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiHeart, FiTag, FiMail, FiCalendar, FiHash } from "react-icons/fi";

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const orders = useSelector((s) => s.orders) || [];
  const navigate = useNavigate();

  if (!user) {
    return (
      <section className="fz-container fz-page">
        <div className="fz-empty" data-testid="profile-locked">
          <span className="fz-empty-icon"><FiPackage /></span>
          <h3>Sign in to view your profile</h3>
          <p>Access your orders, wishlist and account details once you're in.</p>
          <button className="fz-btn" onClick={() => navigate("/signin")} data-testid="profile-signin-cta">
            Sign In
          </button>
        </div>
      </section>
    );
  }

  const initial = (user.email || "U").charAt(0).toUpperCase();
  const stats = [
    { label: "Orders", value: orders.length },
    { label: "Wishlist", value: 0 },
    { label: "Coupons", value: 4 },
  ];

  return (
    <section className="fz-container fz-page" data-testid="profile-page">
      <div className="fz-page-h">
        <div>
          <span className="section-eyebrow">Account</span>
          <h1 style={{ marginTop: 12 }}>Hello, {user.email?.split("@")[0]}</h1>
          <p>Your profile and shopping activity in one place.</p>
        </div>
      </div>

      <div className="fz-profile-grid">
        <motion.div
          className="fz-profile-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="fz-avatar" data-testid="profile-avatar">{initial}</div>
          <h3>{user.email?.split("@")[0]}</h3>
          <div style={{ color: "var(--ink-3)", fontSize: 13, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member since 2024</div>
          <div className="fz-profile-stats">
            {stats.map((s) => (
              <div className="fz-profile-stat" key={s.label}>
                <strong>{s.value}</strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="fz-panel" style={{ marginBottom: 20 }}>
            <h3>Profile Details</h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label"><FiMail style={{ marginRight: 6 }} /> Email</label>
              <input className="form-control" value={user.email || ""} readOnly data-testid="profile-email" />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label"><FiHash style={{ marginRight: 6 }} /> User ID</label>
              <input className="form-control" value={user.uid || ""} readOnly data-testid="profile-uid" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiCalendar style={{ marginRight: 6 }} /> Joined</label>
              <input
                className="form-control"
                value={new Date(user.metadata?.createdAt ? Number(user.metadata.createdAt) : Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                readOnly
              />
            </div>
          </div>

          <div className="fz-panel">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="fz-btn fz-btn-ghost" onClick={() => navigate("/orders")} data-testid="profile-go-orders">
                <FiPackage size={14} /> View Orders
              </button>
              <button className="fz-btn fz-btn-ghost" onClick={() => navigate("/coupons")} data-testid="profile-go-coupons">
                <FiTag size={14} /> Coupons
              </button>
              <button className="fz-btn fz-btn-ghost" onClick={() => navigate("/")}>
                <FiHeart size={14} /> Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
