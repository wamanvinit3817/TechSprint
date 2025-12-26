import "../App.css";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";
import GlobalAlert from "./GlobalAlert";
import { useAlert } from "../context/AlertContext";
import GlobalLoader from "./GlobalLoader";

function Dashboard() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [me, setMe] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState({ itemId: null, token: null });

  /* ================= LOAD USER ================= */
  useEffect(() => {
    apiFetch("http://localhost:5000/auth/me")
      .then(setMe)
      .catch(() => {});
  }, []);

  /* ================= LOAD ITEMS ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("http://localhost:5000/api/items/getallitems");
        setItems(data);
      } catch {
        showAlert("danger", "Server error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "auto";
  }, [selectedItem]);

  /* ================= FILTER LOGIC ================= */
  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.location.toLowerCase().includes(text);

    if (filter === "claimed") return item.status === "claimed" && matchesSearch;
    if (filter === "lost") return item.status === "open" && item.type === "lost" && matchesSearch;
    if (filter === "found") return item.status === "open" && item.type === "found" && matchesSearch;

    return matchesSearch;
  });

  /* ================= QR ================= */
  const generateQR = async (itemId) => {
    try {
      setQrLoading(true);
      const res = await apiFetch(
        `http://localhost:5000/api/items/generate-qr/${itemId}`,
        { method: "POST" }
      );
      setQrData({ itemId, token: res.qrToken });
    } catch {
      showAlert("danger", "Only founder can generate QR");
    } finally {
      setQrLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <GlobalLoader show={loading} />
      <GlobalAlert />

      {/* ================= NAVBAR ================= */}
      <nav className="navbar d-flex align-items-center justify-content-between">

  {/* LEFT SECTION */}
  <div className="d-flex align-items-center gap-2">
    <span className="navbar-brand">Findora</span>

    <button className="nav-link btn" onClick={() => setFilter("all")}>All</button>
    <button className="nav-link btn" onClick={() => setFilter("lost")}>Lost</button>
    <button className="nav-link btn" onClick={() => setFilter("found")}>Found</button>
    <button className="nav-link btn" onClick={() => setFilter("claimed")}>Claimed</button>
  </div>

  {/* CENTER SEARCH */}
  <div className="mx-auto">
    <input
      type="search"
      className="form-control"
      placeholder="Search items..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* RIGHT SIDE */}
  <div className="d-flex align-items-center gap-2">

    <button
      className="btn btn-outline-primary"
      onClick={() => navigate("/add-item")}
    >
      + Add Item
    </button>

    <button
      className="btn btn-outline-secondary"
      onClick={() => navigate("/history")}
    >
      My Items
    </button>

    <button
      className="btn btn-outline-danger"
      onClick={handleLogout}
    >
      Logout
    </button>

    {/* ✅ USER INFO (FINAL FIX) */}
    {me && (
      <div className="user-meta">
        <div className="user-name">
          👤 {me.user?.name}
        </div>
        <div className="user-divider"></div>
        <div className="user-org">
          🎓 {me.organization?.name}
        </div>
      </div>
    )}
  </div>
</nav>


      {/* ================= GRID ================= */}
      <div className="container mt-4">
        {filteredItems.length === 0 ? (
          <div className="alert alert-info">No matching items found</div>
        ) : (
          <div className="row">
            {filteredItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card dashboard-card">
                  <img
                    src={item.imageUrl || defaultImage}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "contain" }}
                    alt=""
                  />

                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5>{item.title}</h5>
                      <span
                        className={`badge ${
                          item.status === "claimed"
                            ? "bg-secondary"
                            : item.type === "lost"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {item.status === "claimed"
                          ? "CLAIMED"
                          : item.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted">
                      <i className="fa-solid fa-user"></i>{" "}
                      {item.postedBy?.name}
                    </p>

                    {item.status === "claimed" && item.claimedBy && (
                      <p className="text-success">
                        <i className="fa-solid fa-user-check"></i>{" "}
                        Claimed by <b>{item.claimedBy.name}</b>
                      </p>
                    )}

                    <p>{item.description}</p>

                    <p className="text-muted">
                      <i className="fa-solid fa-location-dot"></i>{" "}
                      {item.location}
                    </p>

                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedItem.title}</h5>
                <button className="close" onClick={() => setSelectedItem(null)}>×</button>
              </div>

              <div className="modal-body">
                <img
                  src={selectedItem.imageUrl || defaultImage}
                  className="img-fluid mb-3"
                  alt=""
                />

                <p>{selectedItem.description}</p>
                <p><b>Location:</b> {selectedItem.location}</p>

                {/* 🔍 POSSIBLE MATCHES */}
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
            alt=""
            style={{
              width: "55px",
              height: "55px",
              objectFit: "cover",
              borderRadius: "6px",
              marginRight: "10px"
            }}
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


                {selectedItem.status === "claimed" && selectedItem.claimedBy && (
                  <div className="alert alert-success">
                    ✅ Claimed by <strong>{selectedItem.claimedBy.name}</strong>
                  </div>
                )}

                {selectedItem.type === "found" && selectedItem.founderContact && (
                  <div className="alert alert-info">
                    <b>Contact:</b> {selectedItem.founderContact}
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
                <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                  Close
                </button>

                {selectedItem.type === "found" &&
                  selectedItem.status !== "claimed" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => generateQR(selectedItem._id)}
                      disabled={qrLoading}
                    >
                      {qrLoading ? "Generating..." : "Generate QR"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
