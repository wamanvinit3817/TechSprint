import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  // 🔐 redirect animation state
  const [redirecting, setRedirecting] = useState(false);

  // 🌙 / ☀️ theme toggle
  const toggleTheme = () => {
    document.body.classList.toggle("light");
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (!error) return;

    if (error === "invalid_college_domain") {
      setErrorMsg("Please login using your college email ID");
    }

    if (error === "invalid_society_code") {
      setErrorMsg("Invalid society invite code");
    }

    if (error === "inactive_society") {
      setErrorMsg("This society is currently inactive");
    }

    if (error === "invalid_college_code") {
      setErrorMsg("Invalid college invite code");
    }

    setTimeout(() => setErrorMsg(""), 2000);
    navigate("/", { replace: true });
  }, [location.search, navigate]);

  return (
    <div className="app-wrapper">
      {/* 🌙 / ☀️ Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="toggle-thumb"></span>
      </button>

      <div className="auth-card">
        <h2 className="auth-title">Campus Lost & Found</h2>

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "15px" }}>{errorMsg}</p>
        )}

        {/* 🔐 Secure Redirect Button */}
        <button
          className={`auth-btn ${redirecting ? "auth-btn-loading" : ""}`}
          disabled={redirecting}
          onClick={() => {
            setRedirecting(true);
            setTimeout(() => {
              window.location.href = "http://localhost:5000/auth/google";
            }, 900);
          }}
        >
          {redirecting ? "Redirecting securely…" : "Login as College Student"}
        </button>

        <p className="auth-text">Valid college email required</p>

        <div className="auth-divider" />

        <button
          onClick={() => navigate("/society-login")}
          className="auth-btn"
        >
          Login as Society Member
        </button>

        <p className="auth-text">Valid invite code required</p>

        <div className="auth-divider" />

        <button
          onClick={() => navigate("/college-code-login")}
          className="auth-btn"
        >
          Login as College (Invite Code)
        </button>

        <p className="auth-text">
          For colleges without official email domains
        </p>
      </div>
    </div>
  );
}

export default Login;
