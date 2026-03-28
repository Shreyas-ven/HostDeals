import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ ADD
import "./styles/Login.css";



const Login = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ ADD
  

  const navigate = useNavigate();

  const handleLogin = async () => {
  setIsLoading(true);
  setMessage("");

  try {
    const res = await loginUser({ email, password });

    console.log("RESPONSE:", res); // 🔥 DEBUG

    if (res.data.success) {
      onLogin(email);

      localStorage.setItem("userEmail", res.data.email || email);

      navigate("/dashboard");
    } else {
      setMessage(res.data.message);
    }

  } catch (err) {
    console.log("FULL ERROR:", err); // 🔥 IMPORTANT

    // 👇 show better error
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Server not reachable";

    setMessage(msg);

  } finally {
    setIsLoading(false);
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

        <button
  className="signup-btn"
  onClick={() => navigate("/register")}
>
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

          <button
            onClick={handleLogin}
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "LOGIN"}
          </button>

          {/* 🔥 Animated Loader */}
          {isLoading && (
            <div className="loader-container">
              <motion.div
                className="loader"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            </div>
          )}

          <p className="login-message">{message}</p>
        </div>
      </div>

    </div>
  );
};

export default Login;