import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logoutAsync } from "../Service/Actions/authActions";
import { filterByPrice, searchByName, filterByCategory } from "../Service/Actions/productActions";
import { toast } from "react-toastify";
import { useTheme } from "../Context/ThemeContext";
import {
  FiSearch, FiShoppingBag, FiPlus, FiUser, FiSun, FiMoon,
  FiHeart, FiPackage, FiTag, FiLogOut, FiChevronDown
} from "react-icons/fi";

const CATEGORIES = ["All", "Mobiles", "Electronics", "Audio", "Wearables", "Camera", "Accessories", "Toys", "Decorations"];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart);
  const user = useSelector((s) => s.auth.user);
  const productCategory = useSelector((s) => s.products?.category || "");
  const { theme, toggle } = useTheme();
  const [activeChip, setActiveChip] = useState("All");

  const handleSearch = (e) => dispatch(searchByName(e.target.value));
  const handlePrice = (e) => {
    const v = e.target.value;
    if (!v) return dispatch(filterByPrice([]));
    const [a, b] = v.split("-").map(Number);
    dispatch(filterByPrice([a, b || 999999]));
  };
  const handleCategory = (cat) => {
    setActiveChip(cat);
    dispatch(filterByCategory(cat === "All" ? "" : cat));
  };
  const handleCart = () => {
    if (!user) {
      toast.info("Please sign in to view your cart");
      setTimeout(() => navigate("/signin"), 800);
      return;
    }
    navigate("/cart");
  };
  const handleAdd = () => {
    if (!user) {
      toast.info("Please sign in to list a product");
      return navigate("/signin");
    }
    navigate("/add-product");
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutAsync());
      toast.success("Signed out");
      navigate("/signin");
    } catch {
      toast.error("Could not sign out");
    }
  };

  return (
    <>
      {user && (
        <div className="fz-greet" data-testid="user-greeting">
          Welcome back, <b>{user.email?.split("@")[0]}</b>
        </div>
      )}
      <nav className="fz-nav" data-testid="navbar">
        <div className="fz-container fz-nav-row">
          <div className="fz-brand" onClick={() => navigate("/")} data-testid="brand-logo" style={{ cursor: "pointer" }}>
            FlipZone <span className="fz-brand-dot" />
          </div>

          <div className="fz-search">
            <FiSearch className="fz-search-icon" size={16} />
            <input
              type="text"
              placeholder="Search products, brands, categories…"
              onChange={handleSearch}
              data-testid="search-input"
            />
          </div>

          <div className="fz-nav-actions">
            <select
              className="form-select fz-filter-select d-none d-md-inline-block"
              onChange={handlePrice}
              defaultValue=""
              data-testid="price-filter"
            >
              <option value="">All Prices</option>
              <option value="0-1000">Under ₹1,000</option>
              <option value="1000-5000">₹1k – ₹5k</option>
              <option value="5000-20000">₹5k – ₹20k</option>
              <option value="20000-50000">₹20k – ₹50k</option>
              <option value="50000-9999999">Above ₹50k</option>
            </select>

            <button
              className="fz-icon-btn"
              onClick={toggle}
              title="Toggle theme"
              data-testid="theme-toggle"
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            <button className="fz-icon-btn d-none d-md-inline-flex" onClick={handleAdd} title="Add Product" data-testid="add-product-nav">
              <FiPlus size={18} />
            </button>

            <button className="fz-icon-btn" onClick={handleCart} title="Cart" data-testid="cart-button">
              <FiShoppingBag size={18} />
              {cart.length > 0 && <span className="fz-cart-badge">{cart.length}</span>}
            </button>

            {user ? (
              <div className="dropdown">
                <button
                  className="fz-icon-btn"
                  data-bs-toggle="dropdown"
                  data-testid="user-menu-trigger"
                >
                  <FiUser size={18} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate("/profile")} data-testid="menu-profile"><FiUser /> Profile</button></li>
                  <li><button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate("/orders")} data-testid="menu-orders"><FiPackage /> Orders</button></li>
                  <li><button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate("/coupons")} data-testid="menu-coupons"><FiTag /> Coupons</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item d-flex align-items-center gap-2" style={{ color: "var(--danger)" }} onClick={handleLogout} data-testid="menu-logout"><FiLogOut /> Sign Out</button></li>
                </ul>
              </div>
            ) : (
              <button className="fz-signin-btn" onClick={() => navigate("/signin")} data-testid="signin-button">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {location.pathname === "/" && (
        <div className="fz-categories" data-testid="categories-strip">
          <div className="fz-container">
            <div className="fz-categories-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className="fz-chip"
                  data-active={activeChip === cat}
                  onClick={() => handleCategory(cat)}
                  data-testid={`chip-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
