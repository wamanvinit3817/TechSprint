import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (!error) return;

    if (error === "invalid_college_domain") {
      setErrorMsg("Please login using your college email ID");
    } else if (error === "invalid_society_code") {
      setErrorMsg("Invalid society invite code");
    } else if (error === "inactive_society") {
      setErrorMsg("This society is currently inactive");
    } else if (error === "invalid_college_code") {
      setErrorMsg("Invalid college invite code");
    }

    setTimeout(() => setErrorMsg(""), 2500);
    navigate("/", { replace: true });
  }, [location.search, navigate]);

  return (
    <>
      {/* 🌙 / ☀️ THEME TOGGLE */}
      <ThemeToggle />

      <div className="app-background">
        <div className="glass-card">

          {/* ================= BRAND ================= */}
          <div className="brand">
            <div className="brand-magnifier">
              <span>F</span>
            </div>
            <h1 className="brand-name">indora</h1>
          </div>

          <p className="brand-subtitle">Campus Lost & Found</p>

          {/* ================= ERROR ================= */}
          {errorMsg && <div className="error-text">{errorMsg}</div>}

          {/* ================= BUTTON 1 (PRIMARY / RED) ================= */}
          <button
            className="primary-btn red-btn"
            onClick={() =>
              (window.location.href = "http://localhost:5000/auth/google")
            }
          >
            Login as College Student
          </button>
          <p className="helper-text">Valid college email required</p>

          <div className="divider" />

          {/* ================= BUTTON 2 (BLUE / DEFAULT) ================= */}
          <button
            className="primary-btn blue-btn"
            onClick={() => navigate("/society-login")}
          >
            Login as Society Member
          </button>
          <p className="helper-text">Valid invite code required</p>

          <div className="divider" />

          {/* ================= BUTTON 3 (GREEN) ================= */}
          <button
            className="primary-btn green-btn"
            onClick={() => navigate("/college-code-login")}
          >
            Login as College (Invite Code)
          </button>
          <p className="helper-text">
            For colleges without official email domains
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;
