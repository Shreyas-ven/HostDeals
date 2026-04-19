import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/MyHosting.css";

const MyHosting = ({ userEmail }) => {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [domain, setDomain] = useState("");
  const [region, setRegion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // ✅ ADDED

  const email = userEmail || localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      console.log("❌ No email found");
      return;
    }

    fetch(`/api/my-sites?email=${email}`)
      .then(res => res.json())
      .then(data => setSites(data))
      .catch(err => console.error("Error fetching sites:", err));
  }, [email]);

  const handleCreate = () => {
    console.log("Create site:", domain, region);
    setShowForm(false);
    setDomain("");
    setRegion("");
  };

  // ✅ CONFIRM DELETE FUNCTION (ADDED)
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
    await fetch("/api/delete-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: deleteTarget.repo,
        email: email
      })
    });
    } catch (err) {
      alert("Failed to delete site");
}

    setSites(prev => prev.filter(s => s.repo !== deleteTarget.repo));
    setDeleteTarget(null);
  };

  return (
    <div className="hosting-page">

      {/* HEADER */}
      <header className="hosting-header">
        <div className="logo">HostDeals</div>
        <div className="header-right">
          <button className="home-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Dashboard
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="hosting-content">
        <h1>MY HOSTED WEBSITES</h1>

        <div className="hosting-list">
          {sites.length === 0 && <p>No hosted websites yet.</p>}

          {sites.map((site, idx) => (
            <div className="hosting-row" key={idx}>
              <div className="site-info">
                <h3>{site.domain}</h3>
                <p className={site.status === "Running" ? "running" : "stopped"}>
                  {site.status}
                </p>
              </div>

              <div className="actions">

                <a href={site.url} target="_blank" rel="noreferrer">
                  <button className="glass-btn">Visit</button>
                </a>

                {site.status === "Running" ? (
                  <button
                    className="glass-btn"
                    onClick={async () => {
                      await fetch("/api/stop-site", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          repo: site.repo,
                          email: email
                        })
                      });

                      setSites(prev =>
                        prev.map(s =>
                          s.repo === site.repo ? { ...s, status: "Stopped" } : s
                        )
                      );
                    }}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    className="glass-btn"
                    onClick={async () => {
                      await fetch("/api/start-site", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          repo: site.repo,
                          email: email
                        })
                      });

                      setSites(prev =>
                        prev.map(s =>
                          s.repo === site.repo ? { ...s, status: "Running" } : s
                        )
                      );
                    }}
                  >
                    Start
                  </button>
                )}

                {/* ✅ UPDATED DELETE BUTTON */}
                <button
                  className="glass-btn delete"
                  onClick={() => setDeleteTarget(site)}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      </main>

      {/* EXISTING MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Hosting</h2>

            <input
              placeholder="Enter subdomain (e.g. shreyas)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />

            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Select Region</option>
              <option>India</option>
              <option>US</option>
              <option>Europe</option>
            </select>

            <div className="modal-actions">
              <button className="glass-btn" onClick={handleCreate}>
                Launch
              </button>
              <button className="glass-btn delete" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal glass delete-modal">
            <h2>⚠️ Confirm Delete</h2>
            <p>
              Are you sure you want to delete <b>{deleteTarget.domain}</b>?
            </p>

            <div className="modal-actions">
              <button className="glass-btn delete" onClick={confirmDelete}>
                Yes, Delete
              </button>

              <button
                className="glass-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="dash-footer">
        HostDeals | shreyasvbangera@gmail.com | 8073318562
        <br />
        All copyrights reserved
      </footer>
    </div>
  );
};

export default MyHosting;