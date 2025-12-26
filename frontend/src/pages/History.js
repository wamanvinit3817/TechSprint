import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function History() {
  const [postedItems, setPostedItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [qrData, setQrData] = useState({ itemId: null, token: null });

  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      try {
        const posted = await apiFetch("http://localhost:5000/api/items/my-posted");
        const claimed = await apiFetch("http://localhost:5000/api/items/my-claimed");
        setPostedItems(posted);
        setClaimedItems(claimed);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const deleteItem = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await apiFetch(`http://localhost:5000/api/items/delete/${itemId}`, {
        method: "DELETE",
      });
      setPostedItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      alert(err.message);
    }
  };

  const generateQR = async (itemId) => {
    try {
      const res = await apiFetch(
        `http://localhost:5000/api/items/generate-qr/${itemId}`,
        { method: "POST" }
      );
      setQrData({ itemId, token: res.qrToken });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h4>My Items</h4>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>

      {/* ================= MY POSTED ITEMS ================= */}
      <h5 className="mb-3">📦 My Posted Items</h5>

      {postedItems.length === 0 ? (
        <div className="alert alert-info">No items posted yet</div>
      ) : (
        <div className="row mb-5">
          {postedItems.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card">
                <img
                  src={item.imageUrl || defaultImage}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt=""
                />

                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h5>{item.title}</h5>
                    <span
                      className={`badge ${
                        item.type === "lost" ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-muted">{item.location}</p>

                  {item.status === "claimed" && (
                    <span className="badge bg-secondary mb-2">CLAIMED</span>
                  )}

                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSelectedItem(item);
                        setQrData({ itemId: null, token: null });
                      }}
                    >
                      View Details
                    </button>

                    {item.status !== "claimed" && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MY CLAIMED ITEMS ================= */}
      <h5 className="mb-3">✅ My Claimed Items</h5>

      {claimedItems.length === 0 ? (
        <div className="alert alert-info">You haven’t claimed any items</div>
      ) : (
        <div className="row">
          {claimedItems.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card border-success">
                <img
                  src={item.imageUrl || defaultImage}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt=""
                />

                <div className="card-body">
                  <h5>{item.title}</h5>
                  <p className="text-muted">{item.location}</p>

                  <span className="badge bg-success mb-2">CLAIMED</span>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setQrData({ itemId: null, token: null });
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedItem.title}</h5>
                <button
                  className="close"
                  onClick={() => {
                    setSelectedItem(null);
                    setQrData({ itemId: null, token: null });
                  }}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <img
                  src={selectedItem.imageUrl || defaultImage}
                  className="img-fluid mb-3"
                  alt=""
                />

                <p>{selectedItem.description}</p>
                <p className="text-muted">{selectedItem.location}</p>

                {/* ✅ MATCHES FIXED */}
                {selectedItem.matchCandidates?.length > 0 && (
                  <div className="alert alert-warning mt-3">
                    <h6>🔍 Possible Matches</h6>

                    {selectedItem.matchCandidates.map((m, i) => {
                      const match = m.itemId;
                      if (!match) return null;

                      return (
                        <div
                          key={i}
                          className="d-flex align-items-center border rounded p-2 mb-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedItem(match)}
                        >
                          <img
                            src={match.imageUrl || defaultImage}
                            style={{
                              width: "55px",
                              height: "55px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginRight: "10px"
                            }}
                            alt=""
                          />
                          <div>
                            <strong>{match.title}</strong>
                            <div style={{ fontSize: "0.85rem" }}>
                              Confidence: {Math.round(m.score * 100)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {qrData.token && qrData.itemId === selectedItem._id && (
                  <div className="text-center mt-3">
                    <QRCodeCanvas
                      value={`http://localhost:3000/verify-claim?token=${qrData.token}`}
                      size={200}
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedItem(null);
                    setQrData({ itemId: null, token: null });
                  }}
                >
                  Close
                </button>

                {selectedItem.status !== "claimed" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => generateQR(selectedItem._id)}
                  >
                    Generate QR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
