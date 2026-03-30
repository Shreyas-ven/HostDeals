import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/Menu.css";

const Menu = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      name: "GitHub Integration",
      desc: "Securely connect your GitHub account using a personal access token and manage repositories directly from HostDeals."
    },
    {
      name: "Instant Deployment",
      desc: "Upload your website files and automatically deploy them using GitHub Pages with a live public URL."
    },
    {
      name: "Repository Automation",
      desc: "We automatically create and manage repositories for your projects without manual setup."
    },
    {
      name: "Live Website Hosting",
      desc: "Your sites are hosted globally using GitHub Pages with fast performance and reliable uptime."
    },
    {
      name: "Project Management",
      desc: "View, manage, and delete your deployed websites anytime from your dashboard."
    },
    {
      name: "Secure Ownership",
      desc: "All your code stays in your GitHub account, giving you full control and version history."
    }
  ];

  return (
    <div className="menu-page">
      <h1 className="menu-title">Our Platform Features</h1>

      <div className="menu-grid">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="menu-card"
            whileHover={{ scale: 1.08, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveService(service)}
          >
            <h2>{service.name}</h2>
          </motion.div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-modal"
              initial={{ scale: 0.7, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 100 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <h2>{activeService.name}</h2>
              <p>{activeService.desc}</p>

              <button
                className="close-btn"
                onClick={() => setActiveService(null)}
              >
                ✖ Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;