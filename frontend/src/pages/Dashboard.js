import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
    return;
  }

  fetch("http://localhost:5000/api/me", {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/");
    });
}, []);


  return (
    <div className="container my-3">
      <h2>Lost & Found Dashboard</h2>
      <p>You are logged in.</p>

      <button className="btn btn-primary"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
