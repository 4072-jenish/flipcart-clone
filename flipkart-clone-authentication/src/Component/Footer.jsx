import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="fz-footer" data-testid="footer">
      <div className="fz-container">
        <div className="fz-footer-grid">
          <div className="fz-footer-brand">
            <h2>FlipZone<span style={{ color: 'var(--accent)' }}>.</span></h2>
            <p>Curated commerce for the discerning. Premium products, considered design, and an experience worth coming back to.</p>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li onClick={() => navigate("/")} data-testid="footer-link-all">All Products</li>
              <li onClick={() => navigate("/")}>New Arrivals</li>
              <li onClick={() => navigate("/")}>Bestsellers</li>
              <li onClick={() => navigate("/coupons")} data-testid="footer-link-coupons">Offers</li>
            </ul>
          </div>
          <div>
            <h5>Account</h5>
            <ul>
              <li onClick={() => navigate("/profile")} data-testid="footer-link-profile">Profile</li>
              <li onClick={() => navigate("/orders")} data-testid="footer-link-orders">Orders</li>
              <li onClick={() => navigate("/cart")} data-testid="footer-link-cart">Cart</li>
              <li onClick={() => navigate("/signin")}>Sign In</li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>About</li>
              <li>Sustainability</li>
              <li>Press</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="fz-footer-bottom">
          <span>© {new Date().getFullYear()} FlipZone — All rights reserved</span>
          <span>Designed in India · Crafted with intent</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
