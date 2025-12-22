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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Campus Lost & Found</h2>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {errorMsg}
        </div>
      )}

      <button
        onClick={() => window.location.href = "http://localhost:5000/auth/google"}
        className="btn btn-outline-primary my-3"
      >
        Login as college student
      </button>

      <p style={{ fontSize: "small" }}>
        Note: Valid college email required
      </p>

      <hr style={{ width: "300px", margin: "30px auto" }} />

      <button
        onClick={() => navigate("/society-login")}
        className="btn btn-outline-primary my-3"
      >
        Login as Society Member
      </button>
      <p style={{ fontSize: "small" }}>
        Note: Valid invite code required
      </p>
      <hr style={{ width: "300px", margin: "30px auto" }} />
      <button
  onClick={() => navigate("/college-code-login")}
  className="btn btn-outline-primary my-3"
>
  Login as College (Invite Code)
</button>

<p style={{ fontSize: "small" }}>
  Note: For colleges without official email domains
</p>

    </div>
  );
}

export default Login;
