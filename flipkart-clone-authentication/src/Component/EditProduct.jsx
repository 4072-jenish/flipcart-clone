import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { editProductAsync } from "../Service/Actions/productActions";
import { toast, ToastContainer } from 'react-toastify';
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaRupeeSign,
  FaStar,
  FaTags,
  FaImage,
  FaAlignLeft,
  FaEdit,
  FaCloudUploadAlt,
  FaSave,
  FaTimes
} from "react-icons/fa";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    rating: ""
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setForm(productSnap.data());
        } else {
          toast.error("Product not found");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        toast.error("Failed to load product");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "flip-images");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dd8rb9luw/image/upload", data, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      setForm({ ...form, image: res.data.secure_url });
      toast.success("Image updated successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editProductAsync(id, form));
      toast.success("✨ Product updated successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-5"
    >
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <div className="form-modern mx-auto" style={{ maxWidth: "800px" }}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-5"
        >
          <div className="profile-avatar mx-auto mb-3">
            <FaEdit />
          </div>
          <h2 className="display-6 fw-bold" style={{
            background: "linear-gradient(135deg, #00b4db, #0083b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Edit Product
          </h2>
          <p className="text-muted">Update your product details</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label">
                <FaBoxOpen className="form-icon" /> Product Name
              </label>
              <input
                required
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <FaRupeeSign className="form-icon" /> Price
              </label>
              <input
                required
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <FaTags className="form-icon" /> Category
              </label>
              <select
                required
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Electronics">📱 Electronics</option>
                <option value="Fashion">👗 Fashion</option>
                <option value="Books">📚 Books</option>
                <option value="Mobiles">📞 Mobiles</option>
                <option value="Camera">📷 Camera</option>
                <option value="Accessories">🎧 Accessories</option>
                <option value="Toys">🧸 Toys</option>
                <option value="Audio">🔊 Audio</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">
                <FaImage className="form-icon" /> Product Image
              </label>
              <div className="upload-area" style={{
                border: '2px dashed var(--border-light)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                background: 'var(--bg-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <FaCloudUploadAlt size={40} color="#00b4db" />
                  <p className="mt-2 mb-0">Click to upload new image</p>
                  <small className="text-muted">PNG, JPG, GIF up to 10MB</small>
                </label>
              </div>

              {uploading && (
                <div className="mt-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${uploadProgress}%`,
                          background: 'linear-gradient(135deg, #00b4db, #0083b0)'
                        }}
                      />
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}

              {form.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="image-preview"
                >
                  <img src={form.image} alt="Preview" />
                </motion.div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label">
                <FaAlignLeft className="form-icon" /> Description
              </label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <FaStar className="form-icon" /> Rating
              </label>
              <input
                required
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                className="form-control"
                value={form.rating}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 text-center mt-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-gradient px-5 py-3"
                disabled={uploading}
                style={{ fontSize: '1.1rem' }}
              >
                <FaSave className="me-2" />
                Update Product
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn-outline-gradient ms-3 px-5 py-3"
                onClick={() => navigate("/")}
              >
                <FaTimes className="me-2" />
                Cancel
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProduct;