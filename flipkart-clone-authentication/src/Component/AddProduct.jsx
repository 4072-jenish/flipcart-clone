import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './common.css';
import axios from 'axios';
import { 
  FaBoxOpen, FaRupeeSign, FaStar, FaTags, 
  FaImage, FaAlignLeft, FaCloudUploadAlt, FaCheckCircle 
} from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { addProductAsync } from '../Service/Actions/productActions';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    rating: '',
  });

  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      toast.success("✨ Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image ⁉");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, category, image, description, rating } = form;
    if (!name || !price || !category || !rating) {
      toast.error("Please fill all required fields!");
      return;
    }

    const newProduct = {
      name,
      price: parseFloat(price),
      category,
      image: image || 'https://via.placeholder.com/150',
      description: description || 'No description provided',
      rating: { rate: parseFloat(rating), count: 1 },
    };

    try {
      await dispatch(addProductAsync(newProduct));
      toast.success("🎉 Product added successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Failed to add product ⁉");
    }
  };

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
            <FaBoxOpen />
          </div>
          <h2 className="display-6 fw-bold" style={{
            background: "linear-gradient(135deg, #00b4db, #0083b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Add New Product
          </h2>
          <p className="text-muted">Fill in the details to list your product</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Product Name */}
            <div className="col-12">
              <label className="form-label">
                <FaBoxOpen className="form-icon" /> Product Name <span className="text-danger">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g., iPhone 15 Pro Max"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Price and Category */}
            <div className="col-md-6">
              <label className="form-label">
                <FaRupeeSign className="form-icon" /> Price <span className="text-danger">*</span>
              </label>
              <input
                required
                type="number"
                name="price"
                className="form-control"
                placeholder="1999"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <FaTags className="form-icon" /> Category <span className="text-danger">*</span>
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

            {/* Image Upload */}
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
                  <p className="mt-2 mb-0">Click to upload or drag and drop</p>
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
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
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
                  <FaCheckCircle className="text-success position-absolute bottom-0 end-0 m-2" size={24} />
                </motion.div>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">
                <FaAlignLeft className="form-icon" /> Description
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Write a detailed description of your product..."
                rows="4"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Rating */}
            <div className="col-md-6">
              <label className="form-label">
                <FaStar className="form-icon" /> Rating <span className="text-danger">*</span>
              </label>
              <input
                required
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                className="form-control"
                placeholder="4.5"
                value={form.rating}
                onChange={handleChange}
              />
              <small className="text-muted">Rate from 0 to 5</small>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center mt-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-gradient px-5 py-3"
                disabled={uploading}
                style={{ fontSize: '1.1rem' }}
              >
                <MdAddShoppingCart className="me-2" size={20} />
                Add Product
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn-outline-gradient ms-3 px-5 py-3"
                onClick={() => navigate("/")}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct;