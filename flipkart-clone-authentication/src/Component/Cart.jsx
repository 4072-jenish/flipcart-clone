import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiPlus, FiMinus, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import { removeFromCartAsync } from "../Service/Actions/cartActions";
import { placeOrder, clearCart } from "../Service/Actions/orderActions";

const Cart = () => {
  const cart = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  const itemsCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  const handleRemove = (id) => {
    dispatch(removeFromCartAsync(id));
    toast.info("Removed from cart");
  };
  const inc = (id) => dispatch({ type: "INCREASE_QUANTITY", payload: id });
  const dec = (id) => dispatch({ type: "DECREASE_QUANTITY", payload: id });

  const handleCheckout = () => {
    if (!cart.length) return toast.warning("Cart is empty");
    dispatch(placeOrder(cart));
    dispatch(clearCart());
    toast.success("Order placed successfully");
    setTimeout(() => navigate("/orders"), 1200);
  };

  if (cart.length === 0) {
    return (
      <section className="fz-container fz-page" data-testid="cart-empty">
        <ToastContainer position="bottom-right" autoClose={2200} />
        <div className="fz-empty">
          <span className="fz-empty-icon"><FiShoppingBag /></span>
          <h3>Your cart is quiet</h3>
          <p>Nothing here yet. Find something you'll love in the edit.</p>
          <button className="fz-btn" onClick={() => navigate("/")} data-testid="cart-start-shopping">
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="fz-container fz-page" data-testid="cart">
      <ToastContainer position="bottom-right" autoClose={2200} />

      <div className="fz-page-h">
        <div>
          <span className="section-eyebrow">{itemsCount} item{itemsCount > 1 ? "s" : ""}</span>
          <h1 style={{ marginTop: 12 }}>Your Cart</h1>
          <p>Review your selection. Free shipping kicks in over ₹999.</p>
        </div>
        <button className="fz-btn fz-btn-ghost" onClick={() => navigate("/")} data-testid="cart-continue">
          <FiArrowLeft size={14} /> Continue Shopping
        </button>
      </div>

      <div className="fz-cart-grid">
        <div>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="fz-cart-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                layout
                data-testid={`cart-item-${item.id}`}
              >
                <img src={item.image} alt={item.name} className="fz-cart-item-img" onError={(e) => (e.currentTarget.src = "https://placehold.co/200/EDE7DD/0F0F0F?text=No+Image")} />
                <div>
                  <span className="fz-cart-item-cat">{item.category}</span>
                  <h4>{item.name}</h4>
                  <div className="fz-qty" data-testid={`qty-${item.id}`}>
                    <button onClick={() => dec(item.id)} data-testid={`dec-${item.id}`} aria-label="decrease"><FiMinus size={12} /></button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => inc(item.id)} data-testid={`inc-${item.id}`} aria-label="increase"><FiPlus size={12} /></button>
                  </div>
                </div>
                <div className="fz-cart-item-price">
                  <strong>₹{(Number(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}</strong>
                  <div>
                    <button className="fz-link-danger" onClick={() => handleRemove(item.id)} data-testid={`remove-${item.id}`}>
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside>
          <div className="fz-cart-summary">
            <h3>Order Summary</h3>
            <div className="fz-cart-row"><span>Subtotal</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            <div className="fz-cart-row"><span>Shipping</span><span style={{ color: "var(--success)" }}>{total > 999 ? "Free" : "₹49"}</span></div>
            <div className="fz-cart-row"><span>Tax (incl.)</span><span>—</span></div>
            <div className="fz-cart-row total">
              <span>Total</span>
              <span data-testid="cart-total">₹{(total + (total > 999 ? 0 : 49)).toLocaleString("en-IN")}</span>
            </div>

            <button className="fz-btn fz-btn-accent" onClick={handleCheckout} data-testid="cart-checkout">
              <FiShoppingBag size={16} /> Place Order
            </button>

            <div className="fz-cart-trust">
              <div><FiTruck /><div>Fast Delivery</div></div>
              <div><FiShield /><div>Secure Pay</div></div>
              <div><FiRefreshCw /><div>7-Day Return</div></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
