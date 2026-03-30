import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./styles/Overview.css";

const Overview = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <motion.div
      className="overview-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >

      {/* HEADER */}
      <header className="overview-header">
        <div className="logo">HostDeals</div>
        <button className="home-btn" onClick={handleHome}>
          🏠 Home
        </button>
      </header>

      {/* CONTENT */}
      <main className="overview-content">

        <motion.h1
          className="overview-title"
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 1 }}
        >
          Deploy Websites Instantly with GitHub Integration
        </motion.h1>

        <motion.p
          className="overview-desc"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          HostDeals is a smart deployment platform that lets you upload your website files 
          and automatically host them using GitHub Pages. Your files are securely stored 
          in your own GitHub repositories, giving you full ownership, version control, 
          and reliable global hosting — all with a simple dashboard experience.
        </motion.p>

        <motion.section
          className="overview-features"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2>Key Features</h2>
          <ul>
            <li>Connect your GitHub account securely</li>
            <li>Automatically create repositories for your websites</li>
            <li>Upload HTML, CSS, JS, and images directly</li>
            <li>Instant deployment using GitHub Pages</li>
            <li>Full ownership of your code and repositories</li>
            <li>Manage, view, and delete deployments anytime</li>
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
            <li>Sign up and log in to your account</li>
            <li>Connect your GitHub account using a personal access token</li>
            <li>Upload your website files through the dashboard</li>
            <li>We create a repository and deploy your site via GitHub Pages</li>
            <li>Access your live website instantly with a public URL</li>
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
          <p>
            Need help with GitHub connection or deployment? We provide quick support 
            to get your website live without hassle.
          </p>
        </motion.section>

      </main>

    </motion.div>
  );
};

export default Overview;