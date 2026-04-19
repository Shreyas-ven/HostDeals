import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Upload.css";

const Upload = () => {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [domain, setDomain] = useState("");
  const [indexFile, setIndexFile] = useState(null);
  const [cssFiles, setCssFiles] = useState([]);
  const [jsFiles, setJsFiles] = useState([]);
  const [images, setImages] = useState([]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW: used to reset file inputs
  const [resetKey, setResetKey] = useState(0);

  const handleUpload = async () => {
    const email = localStorage.getItem("userEmail");

    if (!domain || !email || !indexFile) {
      setStatus("⚠️ Please upload index.html and fill domain");
      return;
    }

    const formData = new FormData();

    formData.append("domain", domain);
    formData.append("email", email);
    formData.append("index", indexFile);

    cssFiles.forEach(file => formData.append("css", file));
    jsFiles.forEach(file => formData.append("js", file));
    images.forEach(file => formData.append("images", file));

    setShowSuccess(false); // before try

    try {
      setLoading(true);
      setStatus("Uploading...");

      await axios.post(
        "/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ SUCCESS FLOW
      setStatus("");
      setShowSuccess(true);

      // 🔥 Clear inputs
      setDomain("");
      setIndexFile(null);
      setCssFiles([]);
      setJsFiles([]);
      setImages([]);

      // ✅ RESET FILE INPUT UI
      setResetKey(prev => prev + 1);

      // 🔥 Hide animation after 3 sec
      setTimeout(() => setShowSuccess(false), 7000);

    } catch (err) {
      console.log(err.response?.data);
      setStatus("❌ " + (err.response?.data?.message || "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      <header className="upload-header">
        <div className="logo">HostDeals</div>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Dashboard
        </button>
      </header>

      <div className="upload-wrapper">

        <div className="upload-box">

          <h2 className="upload-title">🚀 Deploy Your Website</h2>

          <input
            className="input"
            placeholder="Enter your domain (e.g. mysite)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          {/* INDEX */}
          <label className="file-label">index.html</label>
          <input
            key={resetKey}
            className="file-input"
            type="file"
            accept=".html"
            onChange={(e) => setIndexFile(e.target.files[0])}
          />

          {/* CSS */}
          <label className="file-label">CSS Files</label>
          <input
            key={resetKey + 1}
            className="file-input"
            type="file"
            multiple
            accept=".css"
            onChange={(e) => setCssFiles(Array.from(e.target.files))}
          />

          {/* JS */}
          <label className="file-label">JS Files</label>
          <input
            key={resetKey + 2}
            className="file-input"
            type="file"
            multiple
            accept=".js"
            onChange={(e) => setJsFiles(Array.from(e.target.files))}
          />

          {/* IMAGES */}
          <label className="file-label">Images</label>
          <input
            key={resetKey + 3}
            className="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />

          {/* BUTTON */}
          <button
            className={`upload-btn ${loading ? "loading" : ""}`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-content">
                <span className="spinner"></span>
                Deploying...
              </span>
            ) : (
              "🚀 Upload & Deploy"
            )}
          </button>

          <p className="status">{status}</p>

          {/* ✅ SUCCESS ANIMATION */}
          {showSuccess && (
            <div className="success-box">
              <div className="checkmark"></div>
              <p>Deployed Successfully 🚀</p>
              <small>Wait 30 seconds and visit My Hosting page</small>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Upload;