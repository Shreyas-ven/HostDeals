import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [githubUser, setGithubUser] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [githubAccounts, setGithubAccounts] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  // ✅ Fetch GitHub accounts
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://127.0.0.1:5000/get-github?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setGithubAccounts(data.accounts || []);
      })
      .catch(() => setGithubAccounts([]));
  }, []);

  // ✅ Fetch repos
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://127.0.0.1:5000/get-repos?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          setRepos([]);
        }
      })
      .catch(() => setRepos([]));
  }, []);

  // ✅ FIXED FUNCTION (ONLY ONCE — NO DUPLICATES)
  const handleSaveGitHub = async () => {

    if (githubAccounts.length >= 1) {
      toast.error("Only one GitHub account allowed");
      return;
    }

    if (!githubUser || !githubToken) {
      toast("Enter username and token");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/save-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          github_username: githubUser,
          github_token: githubToken
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save GitHub account");
        setLoading(false);
        return;
      }

      toast.success("GitHub Connected");

      setGithubAccounts(prev => [
        ...prev,
        { username: githubUser }
      ]);

      setShowGitModal(false);
      setGithubUser("");
      setGithubToken("");

    } catch (err) {
      console.error(err);
      toast.error("Server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-page">
      <Toaster position="top-right" reverseOrder={false} />

      {/* HEADER */}
      <header className="dash-header">

        <div className="logo">HostDeals</div>

        <div
          className="profile-section"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          ⚙️ Profile

          {showMenu && (
            <div className="dropdown">

              <div onClick={() => navigate("/profile")}>
                My Profile
                </div>

              <div onClick={() => navigate("/subscription")}>
                Subscription
              </div>

              <div onClick={() => setShowGitModal(true)}>
                Set GitHub Repo
              </div>

              <div onClick={handleLogout}>
                Logout
              </div>

            </div>
          )}
        </div>

      </header>

      {/* CONTENT */}
      <main className="dash-content">

        <h1>Dashboard</h1>

        <div className="cards">

          <div className="card" onClick={() => navigate("/my-hosting")}>
            <h3>My Hosting</h3>
            <p>Manage your hosted websites</p>
          </div>

          <div className="card" onClick={() => alert("Domains Page")}>
            <h3>Domains</h3>
            <p>View your domains</p>
          </div>

          <div className="card" onClick={() => navigate("/upload")}>
            <h3>Upload Website</h3>
            <p>Deploy your website</p>
          </div>
    

          {/* Repo List */}
          <div className="card">
            <h3>Your Repositories</h3>
            {repos.length === 0 ? (
              <p>No repos found</p>
            ) : (
              repos.slice(0, 5).map(repo => (
                <p key={repo.id}>{repo.name}</p>
              ))
            )}
          </div>

          <div className="card" onClick={() => navigate("/contact")}>
            <h3>Support</h3>
            <p>Contact us anytime</p>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="dash-footer">
        HostDeals | shreyasvbangera@gmail.com | 8073318562
        <br />
        All copyrights reserved
      </footer>

      {/* MODAL */}
      {showGitModal && (
        <div className="modal-overlay">
          <div className="modal glass">
            <h2>Connect GitHub</h2>

            <p className="token-guide">
  • Enter your GitHub username (your profile name)  
  <br />
  • Go to GitHub → Settings → Developer Settings  
  <br />
  • Generate Personal Access Token (classic)  
  <br />
  • Copy token and paste here (no spaces)
</p>

            <input
              placeholder="GitHub Username"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
            />

            <input
              type="password"   // ✅ FIXED (secure)
              placeholder="GitHub Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />

            <p className="token-warning">
  ⚠️ If already connected, no need to connect again.  
  <br />
  Check it under Profile section.
</p>

            <div className="modal-actions">
              <button
                className="glass-btn"
                onClick={handleSaveGitHub}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Save"}
              </button>

              <button
                className="glass-btn delete"
                onClick={() => setShowGitModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;