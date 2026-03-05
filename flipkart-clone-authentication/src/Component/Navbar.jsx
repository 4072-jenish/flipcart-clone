import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaSearch, FaShoppingCart, FaPlus, FaFilter, 
  FaUserCircle, FaSignOutAlt, FaHeart, FaHistory,
  FaTag, FaCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { filterByPrice, searchByName } from "../Service/Actions/productActions";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logoutAsync } from "../Service/Actions/authActions";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [searchFocused, setSearchFocused] = useState(false);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      dispatch(filterByPrice([]));
    } else {
      const range = value.split("-").map(Number);
      dispatch(filterByPrice(range));
    }
  };

  const handleCart = () => {
    if (!user) {
      toast.warning("Please sign in to view your cart");
      setTimeout(() => navigate("/signin"), 2000);
    } else {
      navigate("/cart");
    }
  };

  const handleSearch = (e) => {
    dispatch(searchByName(e.target.value));
  };

  const handleAddProduct = () => {
    if (!user) {
      toast.warning("Please sign in to add products");
      return navigate("/signin");
    }
    navigate("/add-product");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutAsync());
      toast.success("Signed out successfully");
      navigate("/signin");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
      className="minimal-navbar"
    >
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          {/* Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="minimal-navbar-brand cursor-pointer"
            onClick={() => navigate("/")}
          >
            FlipZone
          </motion.div>

          {/* Search Bar */}
          <div className="position-relative mx-4 flex-grow-1" style={{ maxWidth: "600px" }}>
            <motion.div
              animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
              className="position-relative"
            >
              <input
                type="text"
                className="minimal-search-input w-100"
                placeholder="Search for products, brands and more..."
                onChange={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* Add Product */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="minimal-btn"
              onClick={handleAddProduct}
              title="Add Product"
            >
              <FaPlus />
            </motion.button>

            {/* Filter */}
            <div className="d-flex align-items-center">
              <FaFilter className="me-2 text-muted" />
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="minimal-select"
                onChange={handlePriceChange}
              >
                <option value="">All Prices</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-1500">₹1000 - ₹1500</option>
                <option value="1500-2000">₹1500 - ₹2000</option>
                <option value="2000+">Above ₹2000</option>
              </motion.select>
            </div>

            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="minimal-cart position-relative"
              onClick={handleCart}
            >
              <FaShoppingCart />
              <span className="d-none d-lg-inline">Cart</span>
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ background: 'var(--danger-gradient)' }}
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Menu */}
            <div className="dropdown">
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="minimal-btn dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <FaUserCircle className="me-1" />
                    <span className="d-none d-lg-inline">{user.email?.split("@")[0]}</span>
                  </motion.button>
                  <ul className="dropdown-menu dropdown-menu-end animate-slideDown">
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/profile")}>
                        <FaUserCircle className="me-2" /> Profile
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/orders")}>
                        <FaHistory className="me-2" /> Orders
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/wishlist")}>
                        <FaHeart className="me-2" /> Wishlist
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/coupons")}>
                        <FaTag className="me-2" /> Coupons
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Sign Out
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-gradient"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;