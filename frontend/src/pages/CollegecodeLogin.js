import React, { useState } from "react";

function CollegeCodeLogin() {
  const [code, setCode] = useState("");

  const handleCollegeCodeLogin = () => {
    if (!code.trim()) {
      alert("Please enter a valid college invite code");
      return;
    }

    window.location.href =
      `http://localhost:5000/auth/google?collegeCode=${encodeURIComponent(code)}`;
  };

 return (
  <div className="login-page">
    <div className="login-card">
      <h1 className="app-name">Findora</h1>
      <p className="tagline">College Code Login</p>

      <input
        type="text"
        className="login-input"
        placeholder="Enter College Invite Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="login-btn college"
        onClick={handleCollegeCodeLogin}
      >
        <i className="fa-brands fa-google"></i>
        Continue with Google
      </button>

      <span className="hint">
        Use the invite code provided by your college admin
      </span>
    </div>
  </div>
);

}

export default CollegeCodeLogin;
