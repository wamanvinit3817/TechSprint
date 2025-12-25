import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function VerifyClaim() {
  const params = new URLSearchParams(useLocation().search);
  const token = params.get("token");
  const navigate = useNavigate();

  const [itemId, setItemId] = useState(null);
  const [status, setStatus] = useState("Verifying QR...");

  useEffect(() => {
    const verifyQR = async () => {
      try {
        const res = await apiFetch(
          "http://localhost:5000/api/items/verify-qr",
          {
            method: "POST",
            body: JSON.stringify({ qrToken: token })
          }
        );

        setItemId(res.itemId);
        setStatus("QR verified. Please login to claim this item.");
      } catch (err) {
        setStatus(err.message);
      }
    };

    if (token) verifyQR();
  }, [token]);

  const loginAndClaim = () => {
    // store itemId temporarily
    localStorage.setItem("pendingClaimItem", itemId);
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h4>{status}</h4>

      {itemId && (
        <button
          className="btn btn-primary mt-3"
          onClick={loginAndClaim}
        >
          Login & Claim Item
        </button>
      )}
    </div>
  );
}

export default VerifyClaim;
