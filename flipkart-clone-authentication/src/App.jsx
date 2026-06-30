import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync } from "./Service/Actions/productActions";
import Navbar from "./Component/Navbar";
import ProductGrid from "./Component/productGrid";
import AddProduct from "./Component/AddProduct";
import Cart from "./Component/Cart";
import Hero from "./Component/Hero";
import EditProduct from "./Component/EditProduct";
import ProductDetails from "./Component/ProductDetails";
import SignUp from "./Component/SignUp";
import SignIn from "./Component/SignIn";
import Profile from "./Component/Profile";
import Orders from "./Component/Orders";
import Coupons from "./Component/Coupons";
import Footer from "./Component/Footer";
import TopBanner from "./Component/TopBanner";
import { ThemeProvider } from "./Context/ThemeContext";

const MainApp = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth = ["/signin", "/signup"].includes(location.pathname);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <ThemeProvider>
      {!isAuth && <TopBanner />}
      {!isAuth && <Navbar />}
      {isHome && <Hero />}

      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/coupons" element={<Coupons />} />
      </Routes>

      {!isAuth && <Footer />}
    </ThemeProvider>
  );
};

export default MainApp;
