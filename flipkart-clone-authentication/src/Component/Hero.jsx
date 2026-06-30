import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="fz-hero" data-testid="hero">
      <div className="fz-container">
        <div className="fz-hero-grid">
          <div>
            <motion.span
              className="section-eyebrow"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Winter Edit · 2026
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              style={{ marginTop: 20 }}
            >
              Objects of <em>everyday</em> wonder.
            </motion.h1>
            <motion.p
              className="fz-hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              A considered collection of tech, audio, and lifestyle pieces — each one chosen for how it feels in your hand, your room, and your life.
            </motion.p>
            <motion.div
              className="fz-hero-cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
            >
              <button
                className="fz-btn"
                onClick={() => {
                  const grid = document.querySelector("[data-testid='product-grid']");
                  if (grid) grid.scrollIntoView({ behavior: "smooth" });
                }}
                data-testid="hero-shop-now"
              >
                Shop the Edit <FiArrowUpRight />
              </button>
              <button className="fz-btn fz-btn-ghost" onClick={() => navigate("/coupons")} data-testid="hero-view-offers">
                View Offers
              </button>
            </motion.div>

            <div className="fz-stat-row">
              <div>
                <div className="fz-stat-num">200+</div>
                <div className="fz-stat-lbl">Curated Products</div>
              </div>
              <div>
                <div className="fz-stat-num">4.8<span style={{ color: 'var(--accent)' }}>★</span></div>
                <div className="fz-stat-lbl">Avg. Rating</div>
              </div>
              <div>
                <div className="fz-stat-num">7d</div>
                <div className="fz-stat-lbl">Easy Returns</div>
              </div>
            </div>
          </div>

          <motion.div
            className="fz-hero-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div
              className="fz-hero-card-image"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            <div className="fz-hero-card-meta">
              <div>
                <h4>Studio Essentials</h4>
                <small>15 pieces · From ₹499</small>
              </div>
              <button className="fz-btn fz-btn-accent" onClick={() => navigate("/")} data-testid="hero-explore">
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
