import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { loginAsync } from "../Service/Actions/authActions";
import { FaGoogle, FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(loginAsync(userCredential.user));
      toast.success("✨ Welcome back!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(loginAsync(result.user));
      toast.success("✨ Signed in with Google!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error("Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container min-vh-100 d-flex align-items-center justify-content-center py-5"
    >
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="auth-card"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="profile-avatar mx-auto"
          >
            <FaUserCircle />
          </motion.div>
          <h2 className="fw-bold mt-3" style={{ color: 'var(--text-dark)' }}>Welcome Back!</h2>
          <p className="text-muted">Sign in to continue shopping</p>
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-2" style={{ color: 'var(--primary-color)' }} />
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FaLock className="me-2" style={{ color: 'var(--primary-color)' }} />
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-gradient w-100 py-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="position-relative my-4">
          <hr />
          <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
            OR
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          className="social-login-btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          <FaGoogle style={{ color: '#DB4437' }} />
          Continue with Google
        </motion.button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: 'var(--primary-color)' }}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;