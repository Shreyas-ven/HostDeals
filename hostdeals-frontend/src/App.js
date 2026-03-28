import React, { useState } from "react";
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

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login / Register / Dashboard */}
        <Route
          path="/"
          element={
            user ? (
              <Dashboard username={user} onLogout={() => setUser(null)} />
            ) : showRegister ? (
              <Register
                onBackToLogin={() => setShowRegister(false)}
                onRegisterSuccess={(email) => setUser(email)}
              />
            ) : (
              <Login
                onLogin={(email) => setUser(email)}
                onShowRegister={() => setShowRegister(true)}
              />
            )
          }
        />

        {/* Overview Page */}
        <Route path="/overview" element={<Overview />} />
         <Route path="/pricing" element={<Pricing />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/my-hosting" element={<MyHosting />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/upload" element={<Upload />} />
         <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;