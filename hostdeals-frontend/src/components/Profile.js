import React, { useEffect, useState } from "react";
import "./styles/Profile.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`/api/get-profile?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <h1>HostDeals</h1>
        <h2>My Profile</h2>

        <button
    className="home-btn"
    onClick={() => navigate("/dashboard")}
  >
    🏠 Home
  </button>
      </div>

      {/* MAIN CARD */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* DETAILS */}
        <div className="section">
          <h3>Personal Details</h3>

          <div className="info-grid">
            <div><b>Name:</b> {user.name}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Phone:</b> {user.phone}</div>
            <div><b>Type:</b> {user.type}</div>
            <div><b>Organization:</b> {user.org}</div>
            <div><b>Source:</b> {user.source}</div>
          </div>
        </div>

        {/* GITHUB */}
        <div className="section">
          <h3>GitHub Accounts</h3>

          {user.github_accounts?.length > 0 ? (
            user.github_accounts.map((acc, i) => (
              <div key={i} className="github-card">
                <span>👨‍💻 {acc.username}</span>

                <button
                  className="remove-btn"
                  onClick={async () => {
                    await fetch("/api/delete-github", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: user.email,
                        username: acc.username
                      })
                    });

                    setUser(prev => ({
                      ...prev,
                      github_accounts: prev.github_accounts.filter(
                        a => a.username !== acc.username
                      )
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">No GitHub connected</p>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;