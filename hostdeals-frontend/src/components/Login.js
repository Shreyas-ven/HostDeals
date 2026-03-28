import React, { useState } from "react";
import { loginUser } from "../services/api";
import "./styles/Login.css";

const Login = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  
  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      if (res.data.success) {
        onLogin(email);
        localStorage.setItem("userEmail", res.data.email);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="login-page">

      {/* HEADER */}
      <header className="login-header">
        <div className="logo">HostDeals</div>

        <nav className="glass-nav">
  <a href="/overview" target="_blank" rel="noopener noreferrer">Overview</a>
  <a href="/menu" target="_blank" rel="noopener noreferrer">Menu</a>
  <a href="/pricing" target="_blank" rel="noopener noreferrer">Pricing</a>
  <a href="/contact" target="_blank" rel="noopener noreferrer">Contact</a>
  <a href="/chatbot" target="_blank" rel="noopener noreferrer">ChatBot</a>
</nav>

        <button className="signup-btn" onClick={onShowRegister}>
          👤 Sign Up
        </button>
      </header>

      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="animated-bg"></div>
        <div className="brand">
          <h1>HostDeals</h1>
          <p>Smart Hosting Solutions</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="login-glass-card">
          <h2 className="login-title">Welcome Back</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button onClick={handleLogin} className="login-button">
            LOGIN
          </button>

          <p className="login-message">{message}</p>
        </div>
      </div>

    </div>
  );
};

export default Login;