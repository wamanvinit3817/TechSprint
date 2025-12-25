import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
   

  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    console.log("ERROR FOUND:", error); 
 

    if (!error) return;
  
    if (error === "invalid_college_domain") {
      setErrorMsg("Please login using your college email ID");
       setTimeout(() =>{
            setErrorMsg("");
        },2000)
    }

    if (error === "invalid_society_code") {
        setErrorMsg("Invalid society invite code");
        setTimeout(() =>{
            setErrorMsg("");
        },2000)
      
    }

    if (error === "inactive_society") {
      setErrorMsg("This society is currently inactive");
       setTimeout(() =>{
            setErrorMsg("");
        },2000)
    }
    if (error === "invalid_college_code") {
       setErrorMsg("Invalid college invite code");
       setTimeout(() =>{
            setErrorMsg("");
        },2000)
}


    navigate("/", { replace: true });
  }, [location.search, navigate]);

 return (
  <div className="login-page">
    <div className="login-card">
      {/* App Name */}
      
      <h1 className="app-name">Findora</h1>
      <p className="tagline">Campus Lost &amp; Found System</p>

      {/* Error Message */}
      {errorMsg && (
        <div className="login-error">
          {errorMsg}
        </div>
      )}

      {/* College Login */}
      <button
        className="login-btn google"
        onClick={() =>
          (window.location.href = "http://localhost:5000/auth/google")
        }
      >
        <i className="fa-brands fa-google"></i>
        Login as College Student
      </button>
      <span className="hint">Valid college email required</span>

      <div className="divider">OR</div>

      {/* Society Login */}
      <button
        className="login-btn society"
        onClick={() => navigate("/society-login")}
      >
        <i className="fa-solid fa-users"></i>
        Login as Society Member
      </button>
      <span className="hint">Invite code required</span>

      {/* College Code Login */}
      <button
        className="login-btn college"
        onClick={() => navigate("/college-code-login")}
      >
        <i className="fa-solid fa-building-columns"></i>
        Login as College
      </button>
      <span className="hint">
        For colleges without official email domains
      </span>
    </div>
  </div>
);


}

export default Login;
