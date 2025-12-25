import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrData, setQrData] = useState({ itemId: null, token: null });

  // 🔥 cache for matched item previews
  const [matchedCache, setMatchedCache] = useState({});

  const navigate = useNavigate();

  /* ================= LOAD MY ITEMS ================= */
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await apiFetch(
          "http://localhost:5000/api/items/my-posted"
        );
        setItems(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  /* ================= DELETE ITEM ================= */
  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await apiFetch(
        `http://localhost:5000/api/items/delete/${itemId}`,
        { method: "DELETE" }
      );
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= GENERATE QR ================= */
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

  /* ================= OPEN MATCHED ITEM ================= */
  const openMatchedItem = async (itemId) => {
    try {
      const item = await apiFetch(
        `http://localhost:5000/api/items/by-id/${itemId}`
      );
      setSelectedItem(item);
      setQrData({ itemId: null, token: null });
    } catch {
      alert("Unable to load matched item");
    }
  };

  /* ================= LOAD MATCH PREVIEW (CACHE) ================= */
  const loadMatchedPreview = async (itemId) => {
    if (matchedCache[itemId]) return;

    try {
      const item = await apiFetch(
        `http://localhost:5000/api/items/by-id/${itemId}`
      );

      setMatchedCache((prev) => ({
        ...prev,
        [itemId]: item
      }));
    } catch {
      // silent fail
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>My Items</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-info">No items posted yet</div>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card">
                <img
                  src={item.imageUrl || defaultImage}
                  className="card-img-top"
                  alt="item"
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    backgroundColor: "#f8f9fa"
                  }}
                />

                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h5>{item.title}</h5>
                    <span
                      className={`badge ${
                        item.type === "lost"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-muted">
                    <i className="fa-solid fa-location-dot"></i>{" "}
                    {item.location}
                  </p>

                  <div className="d-flex gap-2">
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
                  <span>&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <img
                  src={selectedItem.imageUrl || defaultImage}
                  className="img-fluid mb-3"
                  alt="item"
                />

                <p>{selectedItem.description}</p>
                <p className="text-muted">
                  <i className="fa-solid fa-location-dot"></i>{" "}
                  {selectedItem.location}
                </p>

                {/* 🔍 POSSIBLE MATCHES (IMAGE + TITLE) */}
                {selectedItem.type === "lost" &&
                  selectedItem.matchCandidates?.length > 0 && (
                    <div className="alert alert-warning mt-3">
                      <h6 className="mb-3">🔍 Possible Matches</h6>

                      {selectedItem.matchCandidates.map((m, i) => {
                        const preview = matchedCache[m.itemId];
                        if (!preview) loadMatchedPreview(m.itemId);

                        return (
                          <div
                            key={i}
                            className="d-flex align-items-center border rounded p-2 mb-2"
                            style={{
                              cursor: "pointer",
                              background: "#fffbe6"
                            }}
                            onClick={() =>
                              openMatchedItem(m.itemId)
                            }
                          >
                            <img
                              src={
                                preview?.imageUrl ||
                                defaultImage
                              }
                              alt="match"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginRight: "12px"
                              }}
                            />

                            <div>
                              <strong>
                                {preview?.title ||
                                  "Matched Item"}
                              </strong>
                              <div
                                style={{
                                  fontSize: "0.85rem"
                                }}
                              >
                                Confidence:{" "}
                                {Math.round(m.score * 100)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {selectedItem.type === "found" &&
                  selectedItem.founderContact && (
                    <div className="alert alert-info">
                      <strong>Contact Finder:</strong>
                      <br />
                      {selectedItem.founderContact}
                    </div>
                  )}

                {qrData.token &&
                  qrData.itemId === selectedItem._id && (
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
                    onClick={() =>
                      generateQR(selectedItem._id)
                    }
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
