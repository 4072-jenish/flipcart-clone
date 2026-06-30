import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUploadCloud, FiPlus, FiX, FiCheck } from "react-icons/fi";
import { addProductAsync } from "../Service/Actions/productActions";

const CATEGORIES = ["Electronics", "Mobiles", "Audio", "Wearables", "Camera", "Accessories", "Toys", "Decorations", "Fashion", "Books"];

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", category: "", image: "", description: "", rating: "" });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "flip-images");
    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dd8rb9luw/image/upload", fd, {
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setForm((f) => ({ ...f, image: res.data.secure_url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category, image, description, rating } = form;
    if (!name || !price || !category || !rating) return toast.error("Please fill required fields");
    try {
      await dispatch(addProductAsync({
        name,
        price: parseFloat(price),
        category,
        image: image || "https://placehold.co/600/EDE7DD/0F0F0F?text=No+Image",
        description: description || "No description provided.",
        rating: { rate: parseFloat(rating), count: 1 },
      }));
      toast.success("Product added");
      setTimeout(() => navigate("/"), 1000);
    } catch {
      toast.error("Could not add product");
    }
  };

  return (
    <section className="fz-container fz-page" data-testid="add-product-page">
      <ToastContainer position="bottom-right" autoClose={2200} />
      <motion.div className="fz-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="fz-form-head">
          <span className="section-eyebrow">List a new piece</span>
          <h1 style={{ marginTop: 14 }}>Add Product</h1>
          <p>Tell us about your product. Quality images and clear descriptions help it stand out.</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input required type="text" name="name" className="form-control" placeholder="e.g. Studio Headphones MK2" value={form.name} onChange={onChange} data-testid="ap-name" />
          </div>
          <div className="fz-form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input required type="number" name="price" className="form-control" placeholder="2999" value={form.price} onChange={onChange} data-testid="ap-price" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select required name="category" className="form-select" value={form.category} onChange={onChange} data-testid="ap-category">
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <label className="fz-upload" htmlFor="ap-image-upload" data-testid="ap-upload-label">
              <FiUploadCloud size={32} />
              <p>Click to upload or drag and drop</p>
              <small>PNG, JPG, WEBP — up to 10MB</small>
              <input id="ap-image-upload" type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} data-testid="ap-image-input" />
            </label>
            {uploading && (
              <>
                <div className="fz-progress"><div className="fz-progress-bar" style={{ width: `${progress}%` }} /></div>
                <small style={{ color: "var(--ink-3)", fontFamily: 'var(--font-mono)' }}>{progress}%</small>
              </>
            )}
            {form.image && (
              <div className="fz-img-preview">
                <img src={form.image} alt="preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="4" placeholder="What makes this product special?" value={form.description} onChange={onChange} data-testid="ap-desc" />
          </div>

          <div className="fz-form-row">
            <div className="form-group">
              <label className="form-label">Rating (0–5) *</label>
              <input required type="number" name="rating" min="0" max="5" step="0.1" className="form-control" placeholder="4.5" value={form.rating} onChange={onChange} data-testid="ap-rating" />
            </div>
          </div>

          <div className="fz-form-actions">
            <button type="button" className="fz-btn fz-btn-ghost" onClick={() => navigate("/")} data-testid="ap-cancel">
              <FiX size={14} /> Cancel
            </button>
            <button type="submit" className="fz-btn" disabled={uploading} data-testid="ap-submit">
              <FiPlus size={14} /> Add Product
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default AddProduct;
