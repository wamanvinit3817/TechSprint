// import React, { useState,useEffect } from "react";

// function SocietyLogin() {
//   const [code, setCode] = useState("");

//   useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   const error = params.get("error");

//   if (error === "invalid_society_code") {
//     alert("Invalid society invite code");
//   }

//   if (error === "inactive_society") {
//     alert("This society is currently inactive");
//   }

//   if (error) {
//     window.history.replaceState({}, document.title, "/society-login");
//   }
// }, []);


//   const handleSocietyLogin = () => {
//     if (!code.trim()) {
//       alert("Please enter a valid society invite code");
//       return;
//     }

//     window.location.href =
//       `http://localhost:5000/auth/google?societyCode=${encodeURIComponent(code)}`;
//   };

//   return ( 
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>Society Member Login</h2>

//       <input
//         type="text"
//         placeholder="Enter Society Invite Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         style={{
//           padding: "10px",
//           width: "260px",
//           marginBottom: "20px"
//         }}
//       />

//       <br />

//       <button
//         onClick={handleSocietyLogin}
//         className="btn btn-primary"
//       >
//         Continue with Google
//       </button>

//       <p style={{ fontSize: "14px", marginTop: "15px", color: "#666" }}>
//         Use the invite code provided by your society admin.
//       </p>
//     </div>
//   );
// }

// export default SocietyLogin;







import React, { useState, useEffect } from "react";

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

    window.location.href = `http://localhost:5000/auth/google?societyCode=${encodeURIComponent(
      code
    )}`;
  };

  return (
    <div className="app-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Society Member Login</h2>

        <input
          type="text"
          placeholder="Enter Society Invite Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="auth-input my-3"
        />

        <button
          onClick={handleSocietyLogin}
          className="auth-btn auth-btn-primary my-3"
        >
          Continue with Google
        </button>

        <p className="auth-text">
          Use the invite code provided by your society admin.
        </p>
      </div>
    </div>
  );
}

export default SocietyLogin;
