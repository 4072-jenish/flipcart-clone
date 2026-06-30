import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { auth } from "../firebase";
import { loginAsync } from "../Service/Actions/authActions";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Use at least 6 characters");
    setLoading(true);
    try {
      const u = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(loginAsync({ uid: u.user.uid, email: u.user.email, metadata: u.user.metadata }));
      toast.success("Account created");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      toast.error(err.message?.replace("Firebase: ", "") || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={2200} />
    <div className="fz-auth-wrap" data-testid="signup-page">
      <motion.aside
        className="fz-auth-side"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <button onClick={() => navigate("/")} style={{ background: 'transparent', border: 'none', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40 }} data-testid="signup-back-home">
            <FiArrowLeft size={14} /> Back to store
          </button>
          <span className="section-eyebrow">Join the community</span>
          <h2 style={{ marginTop: 20 }}>
            Let's get <em>started.</em>
          </h2>
          <p style={{ color: "var(--bg)", opacity: 0.7, maxWidth: 360, marginTop: 18 }}>
            Create your account in seconds. Get early access to new drops, save favourites, and check out faster.
          </p>
        </div>
        <div className="fz-auth-side-foot">FlipZone · est. 2024</div>
      </motion.aside>

      <motion.div
        className="fz-auth-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1>Create account</h1>
        <p>It only takes a minute</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="signup-email"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="signup-password"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              data-testid="signup-confirm"
            />
          </div>
          <button className="fz-btn" type="submit" disabled={loading} data-testid="signup-submit">
            {loading ? "Creating…" : <>Create account <FiArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ marginTop: 28, color: "var(--ink-3)", fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 4 }} data-testid="signup-to-signin">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignUp;
