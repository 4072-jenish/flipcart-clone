import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle } from "react-icons/fa";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { auth, googleProvider } from "../firebase";
import { loginAsync } from "../Service/Actions/authActions";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await signInWithEmailAndPassword(auth, email, password);
      dispatch(loginAsync({ uid: u.user.uid, email: u.user.email, metadata: u.user.metadata }));
      toast.success("Welcome back");
      setTimeout(() => navigate("/"), 800);
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(loginAsync({ uid: result.user.uid, email: result.user.email, metadata: result.user.metadata }));
      toast.success("Signed in with Google");
      setTimeout(() => navigate("/"), 800);
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={2200} />
    <div className="fz-auth-wrap" data-testid="signin-page">
      <motion.aside
        className="fz-auth-side"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <button onClick={() => navigate("/")} style={{ background: 'transparent', border: 'none', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40 }} data-testid="signin-back-home">
            <FiArrowLeft size={14} /> Back to store
          </button>
          <span className="section-eyebrow">Members get more</span>
          <h2 style={{ marginTop: 20 }}>
            Welcome <em>back.</em>
          </h2>
          <p style={{ color: 'var(--bg)', opacity: 0.7, maxWidth: 360, marginTop: 18 }}>
            Sign in to access your wishlist, track orders, and unlock member-only pricing on the edit.
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
        <h1>Sign in</h1>
        <p>Enter your credentials to continue</p>

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
              data-testid="signin-email"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="signin-password"
            />
          </div>
          <button className="fz-btn" type="submit" disabled={loading} data-testid="signin-submit">
            {loading ? "Signing in…" : <>Sign in <FiArrowRight size={16} /></>}
          </button>
        </form>

        <div className="fz-auth-divider">or continue with</div>

        <button className="fz-google-btn" onClick={handleGoogle} disabled={loading} data-testid="signin-google">
          <FaGoogle style={{ color: "#DB4437" }} /> Continue with Google
        </button>

        <p style={{ marginTop: 28, color: "var(--ink-3)", fontSize: 14 }}>
          New to FlipZone?{" "}
          <Link to="/signup" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 4 }} data-testid="signin-to-signup">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignIn;
