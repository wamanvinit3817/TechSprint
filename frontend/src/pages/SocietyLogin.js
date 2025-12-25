import React, { useState,useEffect } from "react";

function SocietyLogin() {
  const [code, setCode] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (error === "invalid_society_code") {
    alert("Invalid society invite code");
  }

  if (error === "inactive_society") {
    alert("This society is currently inactive");
  }

  if (error) {
    window.history.replaceState({}, document.title, "/society-login");
  }
}, []);


  const handleSocietyLogin = () => {
    if (!code.trim()) {
      alert("Please enter a valid society invite code");
      return;
    }

    window.location.href =
      `http://localhost:5000/auth/google?societyCode=${encodeURIComponent(code)}`;
  };

return (
  <div className="login-page">
    <div className="login-card">
      <h1 className="app-name">Findora</h1>
      <p className="tagline">Society Member Login</p>

      <input
        type="text"
        className="login-input"
        placeholder="Enter Society Invite Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="login-btn society"
        onClick={handleSocietyLogin}
      >
        <i className="fa-brands fa-google"></i>
        Continue with Google
      </button>

      <span className="hint">
        Use the invite code provided by your society admin
      </span>
    </div>
  </div>
);

}

export default SocietyLogin;
