import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [me, setMe] = useState(null);

  const [qrData, setQrData] = useState({
    itemId: null,
    token: null
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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

  useEffect(() => {
    apiFetch("http://localhost:5000/auth/me")
      .then((data) => setMe(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await apiFetch(
          "http://localhost:5000/api/items/getallitems"
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

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "auto";
  }, [selectedItem]);

const filteredItems = items.filter((item) => {
  // ✅ hide claimed items only
  if (item.status === "claimed") return false;

  if (filter !== "all" && item.type !== filter) return false;

  const text = search.toLowerCase();
  return (
    item.title.toLowerCase().includes(text) ||
    item.description.toLowerCase().includes(text) ||
    item.location.toLowerCase().includes(text)
  );
});


  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <a className="navbar-brand" href="#" style={{ fontSize: "1rem" }}>
          Findora
        </a>

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => setFilter("all")}
              style={{ fontSize: "0.8rem" }}
            >
              All
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-danger"
              onClick={() => setFilter("lost")}
              style={{ fontSize: "0.8rem" }}
            >
              Lost
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-success"
              onClick={() => setFilter("found")}
              style={{ fontSize: "0.8rem" }}
            >
              Found
            </button>
          </li>
        </ul>

        <form
          className="form-inline mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="form-control mr-2"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "200px" }}
          />
          <button className="btn btn-outline-success" style={{ fontSize: "0.8rem" }}>
            Search
          </button>
        </form>

        <div className="d-flex align-items-center">
          {me?.organization?.name && (
            <span className="badge bg-dark text-white mr-3 px-3 py-2">
              {me.organization.name}
            </span>
          )}

          <button
            className="btn btn-outline-primary mr-2"
            onClick={() => navigate("/add-item")}
            style={{ fontSize: "0.8rem" }}
          >
            + Add Item
          </button>

          <button
            className="btn btn-outline-secondary mr-2"
            onClick={() => navigate("/history")}
            style={{ fontSize: "0.8rem" }}
          >
            My Items
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
            style={{ fontSize: "0.8rem" }}
          >
            Logout
          </button>

          {me && (
            <div className="text-right ml-3">
              <div style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                👤 {me.user?.name}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ================= ITEMS ================= */}
      <div className="container mt-4">
        {filteredItems.length === 0 ? (
          <div className="alert alert-info">No matching items found</div>
        ) : (
          <div className="row">
            {filteredItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={item.imageUrl || defaultImage}
                    className="card-img-top"
                    alt="Item"
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
                          item.type === "lost" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted mb-1">
                      Posted by: <strong>{item.postedBy?.name}</strong>
                    </p>

                    <p>{item.description}</p>
                    <p className="text-muted">
                      <i className="fa-solid fa-location-dot"></i> {item.location}
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

                {/* 🔥 MATCH SECTION */}
                {selectedItem.type === "lost" &&
                  selectedItem.matchCandidates?.length > 0 && (
                    <div className="alert alert-warning mt-3">
                      <h6>🔍 Possible Matches</h6>

                      {selectedItem.matchCandidates.map((m, i) => {
                        const found = items.find((x) => x._id === m.itemId);
                        if (!found) return null;

                        return (
                          <div
                            key={i}
                            className="d-flex align-items-center border rounded p-2 mb-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedItem(found)}
                          >
                            <img
                              src={found.imageUrl || defaultImage}
                              width="55"
                              className="me-2 rounded"
                              alt="match"
                            />
                            <div>
                              <strong>{found.title}</strong>
                              <div>
                                Confidence: {Math.round(m.score * 100)}%
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
                      <strong>Contact Finder:</strong><br />
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

                <button
                  className="btn btn-primary"
                  onClick={() => generateQR(selectedItem._id)}
                >
                  Generate QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
