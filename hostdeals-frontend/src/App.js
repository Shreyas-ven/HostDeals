import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Overview from "./components/Overview";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import MyHosting from "./components/MyHosting";
import Upload from "./components/Upload";
import Profile from "./components/Profile";
import Menu from "./components/Menu";

function App() {
  const handleLogin = (email) => {
    console.log("User logged in:", email);
  };

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-hosting" element={<MyHosting />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />

      </Routes>
    </Router>
  );
}

export default App;