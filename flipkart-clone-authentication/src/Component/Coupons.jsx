import React from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy, FiTag } from "react-icons/fi";

const COUPONS = [
  { code: "WELCOME10", discount: "10%", desc: "10% off your first order", min: "₹500", expiry: "31 Mar 2026" },
  { code: "FREESHIP", discount: "Free", desc: "Free shipping, all orders", min: "No min.", expiry: "31 Dec 2026" },
  { code: "SAVE20", discount: "20%", desc: "On electronics & audio", min: "₹2,000", expiry: "30 Nov 2026" },
  { code: "FLIP200", discount: "₹200", desc: "Flat ₹200 off orders 999+", min: "₹999", expiry: "15 Feb 2026" },
];

const Coupons = () => {
  const copy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <section className="fz-container fz-page" data-testid="coupons-page">
      <ToastContainer position="bottom-right" autoClose={1600} />

      <div className="fz-page-h">
        <div>
          <span className="section-eyebrow">Offers & Coupons</span>
          <h1 style={{ marginTop: 12 }}>Save a little more.</h1>
          <p>Apply these at checkout. Some restrictions apply — see fine print.</p>
        </div>
      </div>

      <div className="fz-coupons-grid">
        {COUPONS.map((c, i) => (
          <motion.div
            key={c.code}
            className="fz-coupon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            data-testid={`coupon-${c.code}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="section-eyebrow"><FiTag size={11} /> Limited time</span>
            </div>
            <div className="fz-coupon-discount" data-testid={`coupon-discount-${c.code}`}>{c.discount}</div>
            <div style={{ color: "var(--ink-2)", fontSize: 14 }}>{c.desc}</div>
            <div className="fz-coupon-code" onClick={() => copy(c.code)} style={{ cursor: 'pointer' }} data-testid={`coupon-code-${c.code}`}>
              {c.code}
            </div>
            <button className="fz-btn fz-btn-ghost" style={{ padding: '10px 16px', justifyContent: 'center' }} onClick={() => copy(c.code)} data-testid={`coupon-copy-${c.code}`}>
              <FiCopy size={13} /> Copy Code
            </button>
            <div className="fz-coupon-meta">
              <span>Min. {c.min}</span>
              <span>Exp. {c.expiry}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Coupons;
