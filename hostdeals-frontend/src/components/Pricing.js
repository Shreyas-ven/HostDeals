import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Pricing.css";

const Pricing = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/"); // redirect to login page
  };

  return (
    <div className="pricing-page">
      {/* HEADER */}
      <header className="pricing-header">
        <div className="logo">HostDeals</div>
        <button className="home-btn" onClick={handleHome}>
          🏠 Home
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="pricing-content">
        <h1>HostDeals Pricing Plans</h1>
        <p>Choose a plan that fits your hosting needs. We have options for everyone!</p>

        <div className="pricing-cards">
          {/* Free Tier */}
          <div className="pricing-card">
            <h2>Free Tier</h2>
            <p>1 hostable domain</p>
            <p>Basic file upload & website launch</p>
            <p>Limited support</p>
            <p className="price">₹0 / forever</p>
          </div>

          {/* Golden Subscriber */}
          <div className="pricing-card golden">
            <h2>Golden Subscriber</h2>
            <p>4 domains / year</p>
            <p>Priority support</p>
            <p>Enhanced server control</p>
            <p className="price">₹499 / year</p>
          </div>

          {/* Premium */}
          <div className="pricing-card premium">
            <h2>Premium</h2>
            <p>10 domains launchable</p>
            <p>SSL + Analytics</p>
            <p>Email notifications</p>
            <p className="price">₹999 / year</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="pricing-footer">
        HostDeals        |       shreyasvbangera@gmail.com     |      8073318562      <br /> <br />       All copyrights reserved
      </footer>
    </div>
  );
};

export default Pricing;