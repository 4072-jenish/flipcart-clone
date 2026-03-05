import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { loginAsync } from "../Service/Actions/authActions";
import { FaUserPlus, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(loginAsync(userCredential.user));
      toast.success("🎉 Account created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.message);
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
            <FaUserPlus />
          </motion.div>
          <h2 className="fw-bold mt-3" style={{ color: 'var(--text-dark)' }}>Create Account</h2>
          <p className="text-muted">Join us and start shopping</p>
        </div>

        <form onSubmit={handleRegister}>
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

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-2" style={{ color: 'var(--primary-color)' }} />
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="text-muted">Minimum 6 characters</small>
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FaCheckCircle className="me-2" style={{ color: 'var(--primary-color)' }} />
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-decoration-none fw-semibold" style={{ color: 'var(--primary-color)' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;