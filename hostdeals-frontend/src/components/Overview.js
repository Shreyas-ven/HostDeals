import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./styles/Overview.css";

const Overview = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <motion.div
      className="overview-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <header className="overview-header">
        <div className="logo">HostDeals</div>
        <button className="home-btn" onClick={handleHome}>
          🏠 Home
        </button>
      </header>

      <main className="overview-content">
        <motion.h1
          className="overview-title"
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 1 }}
        >
          Launch Websites Instantly with HostDeals
        </motion.h1>

        <motion.p
          className="overview-desc"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          HostDeals provides a fast, secure, and free mini hosting platform. Upload your website files,
          get a subdomain instantly, and manage your sites from a simple dashboard.
          Perfect for developers, small businesses, and personal projects.
        </motion.p>

        <motion.section
          className="overview-features"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2>Key Features</h2>
          <ul>
            <li>One-click file upload and website deployment</li>
            <li>Instant subdomain assignment for your site</li>
            <li>View and manage all active websites</li>
            <li>Delete websites anytime with a single click</li>
            <li>SSL integration for secure connections</li>
            <li>Basic analytics and email notifications for updates</li>
          </ul>
        </motion.section>

        <motion.section
          className="overview-how-it-works"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <h2>How It Works</h2>
          <ol>
            <li>Sign up with your email and password</li>
            <li>Upload your website ZIP files via the dashboard</li>
            <li>Launch your website instantly on a subdomain</li>
            <li>Manage your sites, track status, and delete if needed</li>
          </ol>
        </motion.section>

        <motion.section
          className="overview-contact"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2>Contact & Support</h2>
          <p>Email: shreyasvbangera@gmail.com</p>
          <p>Phone: +91 80733 18562</p>
          <p>We provide quick support for deployment issues and site management.</p>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default Overview;