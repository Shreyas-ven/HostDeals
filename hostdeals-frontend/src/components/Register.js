import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [org, setOrg] = useState("");
  const [source, setSource] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await registerUser({
        name,
        email,
        phone,
        type,
        org,
        source,
        password,
      });

      setMessage(res.data.message);

      if (res.data.success) {
        // reset fields
        setName("");
        setEmail("");
        setPhone("");
        setType("");
        setOrg("");
        setSource("");
        setPassword("");

        // ✅ REDIRECT TO LOGIN PAGE
        setTimeout(() => {
          navigate("/");
        }, 1000); // small delay for better UX
      }

    } catch {
      setMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="register-page">

      {/* HEADER */}
      <header className="register-header">
        <div className="logo">HostDeals</div>

        <button className="top-btn" onClick={goHome}>
          Login
        </button>
      </header>

      <div className="register-container">

        <h1 className="register-title">Registration</h1>

        {/* GLASS CARD */}
        <div className="register-card">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option>Student</option>
            <option>Employee</option>
            <option>Freelancer</option>
          </select>

          <input
            placeholder="Organization"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />

          <input
            placeholder="Where did you hear about us?"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Loader */}
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}

          <p className="msg">{message}</p>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="register-footer">
        HostDeals | shreyasvbangera@gmail.com | 8073318562
        <br />
        All copyrights reserved
      </footer>

    </div>
  );
};

export default Register;