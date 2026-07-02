import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUploadCloud, FiSave, FiX } from "react-icons/fi";
import { db } from "../firebase";
import { editProductAsync } from "../Service/Actions/productActions";

const CATEGORIES = ["Electronics", "Mobiles", "Audio", "Wearables", "Camera", "Accessories", "Toys", "Decorations", "Fashion", "Books"];

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", category: "", image: "", description: "", rating: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const data = productSnap.data();
          setForm({
            name: data.name || "",
            price: data.price || "",
            category: data.category || "",
            image: data.image || "",
            description: data.description || "",
            rating: typeof data.rating === "object" ? data.rating?.rate : data.rating || "",
          });
        } else {
          toast.error("Product not found");
          setTimeout(() => navigate("/"), 1200);
        }
      } catch {
        toast.error("Failed to load product");
        setTimeout(() => navigate("/"), 1200);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

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
      toast.success("Image updated");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editProductAsync(id, {
        ...form,
        price: parseFloat(form.price),
        rating: { rate: parseFloat(form.rating), count: 1 },
      }));
      toast.success("Product updated");
      setTimeout(() => navigate("/"), 1000);
    } catch {
      toast.error("Could not update");
    }
  };

  if (loading) {
    return (
      <div className="fz-spinner-wrap" data-testid="edit-loading">
        <div className="fz-spinner" />
      </div>
    );
  }

  return (
    <section className="fz-container fz-page" data-testid="edit-product-page">
      <ToastContainer position="bottom-right" autoClose={2200} />
      <motion.div className="fz-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="fz-form-head">
          <span className="section-eyebrow">Update listing</span>
          <h1 style={{ marginTop: 14 }}>Edit Product</h1>
          <p>Refine details, swap images, and keep your listing fresh.</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input required type="text" name="name" className="form-control" value={form.name} onChange={onChange} data-testid="ep-name" />
          </div>
          <div className="fz-form-row">
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input required type="number" name="price" className="form-control" value={form.price} onChange={onChange} data-testid="ep-price" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select required name="category" className="form-select" value={form.category} onChange={onChange} data-testid="ep-category">
                <option value="">Select</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <label className="fz-upload" htmlFor="ep-image-upload">
              <FiUploadCloud size={32} />
              <p>Click to replace image</p>
              <small>PNG, JPG, WEBP — up to 10MB</small>
              <input id="ep-image-upload" type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
            </label>
            {uploading && (
              <>
                <div className="fz-progress"><div className="fz-progress-bar" style={{ width: `${progress}%` }} /></div>
              </>
            )}
            {form.image && (
              <div className="fz-img-preview"><img src={form.image} alt="preview" /></div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="4" value={form.description} onChange={onChange} data-testid="ep-desc" />
          </div>

          <div className="fz-form-row">
            <div className="form-group">
              <label className="form-label">Rating (0–5)</label>
              <input required type="number" name="rating" min="0" max="5" step="0.1" className="form-control" value={form.rating} onChange={onChange} data-testid="ep-rating" />
            </div>
          </div>

          <div className="fz-form-actions">
            <button type="button" className="fz-btn fz-btn-ghost" onClick={() => navigate("/")} data-testid="ep-cancel">
              <FiX size={14} /> Cancel
            </button>
            <button type="submit" className="fz-btn" disabled={uploading} data-testid="ep-submit">
              <FiSave size={14} /> Update
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default EditProduct;
