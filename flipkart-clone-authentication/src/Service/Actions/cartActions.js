import { db, auth } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

export const fetchCartAsync = () => async (dispatch) => {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/cart`));
    const cartItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    dispatch({ type: "SET_CART", payload: cartItems });
  } catch (e) {
    console.error("fetchCartAsync error", e);
  }
};

export const addToCartAsync = (product) => async (dispatch, getState) => {
  const existing = getState().cart.find((item) => item.id === product.id);
  if (existing) {
    dispatch(increaseQuantityAsync(product.id));
    return;
  }
  const newItem = { ...product, quantity: 1 };
  try { await setDoc(doc(db, "cart", String(product.id)), newItem); } catch (e) { /* offline ok */ }
  dispatch({ type: "ADD_TO_CART", payload: newItem });
};

export const increaseQuantityAsync = (id) => async (dispatch, getState) => {
  const item = getState().cart.find((i) => i.id === id);
  if (!item) return;
  const newQty = (item.quantity || 1) + 1;
  try { await updateDoc(doc(db, "cart", String(id)), { quantity: newQty }); } catch (e) {}
  dispatch({ type: "INCREASE_QUANTITY", payload: id });
};

export const decreaseQuantityAsync = (id) => async (dispatch, getState) => {
  const item = getState().cart.find((i) => i.id === id);
  if (!item) return;
  const newQty = (item.quantity || 1) - 1;
  if (newQty > 0) {
    try { await updateDoc(doc(db, "cart", String(id)), { quantity: newQty }); } catch (e) {}
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  } else {
    try { await deleteDoc(doc(db, "cart", String(id))); } catch (e) {}
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  }
};

export const removeFromCartAsync = (id) => async (dispatch) => {
  try { await deleteDoc(doc(db, "cart", String(id))); } catch (e) {}
  dispatch({ type: "REMOVE_FROM_CART", payload: id });
};
