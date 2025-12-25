import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function History() {
  const [postedItems, setPostedItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("posted");
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrData, setQrData] = useState({ itemId: null, token: null });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const posted = await apiFetch(
          "http://localhost:5000/api/items/my-posted"
        );
        const claimed = await apiFetch(
          "http://localhost:5000/api/items/my-claimed"
        );
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

  /* ================= DELETE ITEM ================= */
  const confirmDelete = async (itemId) => {
    try {
      await apiFetch(
        `http://localhost:5000/api/items/delete/${itemId}`,
        { method: "DELETE" }
      );
      setPostedItems((prev) => prev.filter((i) => i._id !== itemId));
      setDeleteTarget(null);
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

  if (loading) {
    return (
      <div className="history-loader">
        <div className="spinner-border text-light"></div>
        <div className="mt-2">Loading history...</div>
      </div>
    );
  }

  const itemsToRender =
    activeTab === "posted" ? postedItems : claimedItems;

  return (
    <div className="history-page container mt-4">
      {/* HEADER */}
      <div className="history-header d-flex justify-content-between mb-3">
        <h4>My Items</h4>
        <button
          className="history-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <i className="fa fa-arrow-left me-2"></i>Back
        </button>
      </div>

      {/* TABS */}
      <div className="history-tabs mb-4">
        <button
          className={`history-tab ${
            activeTab === "posted" ? "active" : ""
          }`}
          onClick={() => setActiveTab("posted")}
        >
          <i className="fa fa-box me-2"></i> Posted
        </button>

        <button
          className={`history-tab ${
            activeTab === "claimed" ? "active" : ""
          }`}
          onClick={() => setActiveTab("claimed")}
        >
          <i className="fa fa-check-circle me-2"></i> Claimed
        </button>
      </div>

      {/* CARDS */}
      {itemsToRender.length === 0 ? (
        <div className="alert alert-info text-center">
          No items found
        </div>
      ) : (
        <div className="row">
          {itemsToRender.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="history-card">
                <img
                  src={item.imageUrl || defaultImage}
                  alt="item"
                  className="card-img-top"
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

                  <p className="text-muted">{item.location}</p>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="history-btn primary mx-2"
                      onClick={() => {
                        setSelectedItem(item);
                        setQrData({ itemId: null, token: null });
                      }}
                    >
                      <i className="fa fa-eye me-1"></i>View
                    </button>

                    {activeTab === "posted" &&
                      item.status !== "claimed" && (
                        deleteTarget === item._id ? (
                          <>
                            <button
                              className="history-btn danger"
                              onClick={() =>
                                confirmDelete(item._id)
                              }
                            >
                              <i className="fa fa-check me-1"></i>
                              Confirm
                            </button>
                            <button
                              className="history-btn secondary"
                              onClick={() =>
                                setDeleteTarget(null)
                              }
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="history-btn danger"
                            onClick={() =>
                              setDeleteTarget(item._id)
                            }
                          >
                            <i className="fa fa-trash me-1"></i>
                            Delete
                          </button>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedItem && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content history-modal">
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
                  {selectedItem.location}
                </p>

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
                  className="history-btn secondary"
                  onClick={() => {
                    setSelectedItem(null);
                    setQrData({ itemId: null, token: null });
                  }}
                >
                  Close
                </button>

                {selectedItem.status !== "claimed" && (
                  <button
                    className="history-btn primary"
                    onClick={() =>
                      generateQR(selectedItem._id)
                    }
                  >
                    <i className="fa fa-qrcode me-1"></i>
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
