import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContact } from "../services/api";
import "./styles/Contact.css";

const Contact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleHome = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("");

    // ✅ simple validation
    if (!name || !email || !message) {
      setStatus("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await sendContact({
        name,
        email,
        message,
      });

      setStatus(res.data.message);

      if (res.data.message === "Message sent successfully") {
        setName("");
        setEmail("");
        setMessage("");
      }

    } catch (err) {
      setStatus("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      {/* HEADER */}
      <header className="contact-header">
        <div className="logo">HostDeals</div>
        <button className="home-btn" onClick={handleHome}>
          🏠 Home
        </button>
      </header>

      {/* CONTENT */}
      <main className="contact-content">

        <h1>Contact HostDeals</h1>

        <p>Email: shreyasvbangera@gmail.com</p>
        <p>Phone: 8073318562</p>

        <div className="contact-box">

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {loading && <div className="loader"></div>}

          <p>{status}</p>

        </div>

      </main>

      <br /> <br />

      {/* FOOTER */}
      <footer className="contact-footer">
        HostDeals | shreyasvbangera@gmail.com | 8073318562 | <br /> <br />
        <center> All copyrights reserved </center>
      </footer>

    </div>
  );
};

export default Contact;