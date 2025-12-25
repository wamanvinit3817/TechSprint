import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) return;

    localStorage.setItem("token", token);

    const pendingItem = localStorage.getItem("pendingClaimItem");

    if (pendingItem) {
      apiFetch("http://localhost:5000/api/items/final-claim", {
        method: "POST",
        body: JSON.stringify({ itemId: pendingItem })
      })
        .then(() => {
          localStorage.removeItem("pendingClaimItem");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("CLAIM FAILED:", err);
          localStorage.removeItem("pendingClaimItem");
          navigate("/dashboard");
        });
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <p>Finalizing claim...</p>;
}

export default AuthSuccess;
