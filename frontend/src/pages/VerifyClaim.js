import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyClaim() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [itemId, setItemId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setError("Missing QR token");
      return;
    }

    fetch(`http://localhost:5000/api/items/verify-qr?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Server error");
        return data;
      })
      .then((data) => {
        setItemId(data.itemId);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
  }, [params]);

  const claimItem = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/items/final-claim",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // ✅ REQUIRED
          },
          body: JSON.stringify({ itemId })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      alert("✅ Item claimed successfully!");
      navigate("/history");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #5f2c82, #49a09d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: 20
      }}
    >
      <div
        style={{
          background: "#2d1457",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
        }}
      >
        {status === "loading" && (
          <>
            <h2>🔄 Verifying QR...</h2>
            <p>Please wait</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ color: "#ff6b6b" }}>❌ Invalid or Expired QR</h2>
            <p>{error}</p>
          </>
        )}

        {status === "ready" && (
          <>
            <h2>✅ QR Verified</h2>
            <p>You can now claim this item.</p>

            <button
              onClick={claimItem}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#0d6efd",
                color: "white",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Confirm Claim
            </button>
          </>
        )}
      </div>
    </div>
  );
}
