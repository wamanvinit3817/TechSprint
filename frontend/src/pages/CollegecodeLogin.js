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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>College Code Login</h2>

      <input
        type="text"
        placeholder="Enter College Invite Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          padding: "10px",
          width: "260px",
          marginBottom: "20px"
        }}
      />

      <br />

      <button
        onClick={handleCollegeCodeLogin}
        className="btn btn-outline-primary"
      >
        Continue with Google
      </button>

      <p style={{ fontSize: "14px", marginTop: "15px", color: "#666" }}>
        Use the invite code provided by your college admin.
      </p>
    </div>
  );
}

export default CollegeCodeLogin;
