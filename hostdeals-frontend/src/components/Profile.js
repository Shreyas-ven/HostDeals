import React, { useEffect, useState } from "react";
import "./styles/Profile.css";

const Profile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://127.0.0.1:5000/get-profile?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
  const email = localStorage.getItem("userEmail");

  fetch(`http://127.0.0.1:5000/get-profile?email=${email}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then(data => {
      console.log("PROFILE DATA:", data); // ✅ DEBUG

      if (data.message) {
        alert(data.message);
        return;
      }

      setUser(data);
    })
    .catch(err => {
      console.error("ERROR:", err);
      alert("Failed to load profile");
    });
}, []);

  if (!user || !user.email) {
  return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
}

  return (
    <div className="profile-page">

      <h1>My Profile</h1>

      <div className="profile-card">

        <h2>Personal Details</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Type:</strong> {user.type}</p>
        <p><strong>Organization:</strong> {user.org}</p>
        <p><strong>Source:</strong> {user.source}</p>

      </div>

      {/* GitHub Section */}
      <div className="profile-card">

        <h2>GitHub Account</h2>

        {user.github_accounts && user.github_accounts.length > 0 ? (
          user.github_accounts.map((acc, index) => (
            <div key={index} className="github-box">
              ✅ {acc.username}

              <button
                className="delete-btn"
                onClick={async () => {
                  await fetch("http://127.0.0.1:5000/delete-github", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: user.email,
                      username: acc.username
                    })
                  });

                  // refresh UI
                  setUser(prev => ({
                    ...prev,
                    github_accounts: prev.github_accounts.filter(
                      a => a.username !== acc.username
                    )
                  }));
                }}
              >
                Delete
              </button>

            </div>
          ))
        ) : (
          <p>No GitHub connected</p>
        )}

      </div>

    </div>
  );
};

export default Profile;