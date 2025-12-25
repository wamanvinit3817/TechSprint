import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const navigate = useNavigate();

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

  /* 🔐 Auth check */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  /* 👤 Load user info */
  useEffect(() => {
    apiFetch("http://localhost:5000/auth/me")
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  /* 📦 Load items */
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

  /* 🔒 Lock scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "auto";
  }, [selectedItem]);

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

      setQrData({
        itemId,
        token: res.qrToken
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    if (item.status === "claimed") return false;

    const matchesType = filter === "all" || item.type === filter;
    const text = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.location.toLowerCase().includes(text);

    return matchesType && matchesSearch;
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
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <a className="navbar-brand" href="#">Findora</a>

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={() => setFilter("all")}>
              All
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-danger" onClick={() => setFilter("lost")}>
              Lost
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-success" onClick={() => setFilter("found")}>
              Found
            </button>
          </li>
        </ul>

        <form className="form-inline mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control mr-2"
            type="search"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="d-flex align-items-center">
          {me?.organization?.name && (
            <span className="badge bg-dark text-white mr-3 px-3 py-2">
              {me.organization.name}
            </span>
          )}

          <button className="btn btn-outline-primary mr-2" onClick={() => navigate("/add-item")}>
            + Add Item
          </button>

          <button className="btn btn-outline-secondary mr-2" onClick={() => navigate("/history")}>
            My Items
          </button>

          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ITEMS */}
      <div className="container mt-4">
        {filteredItems.length === 0 ? (
          <div className="alert alert-info">No matching items found</div>
        ) : (
          <div className="row">
            {filteredItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card">
                  <img
                    src={item.imageUrl || defaultImage}
                    className="card-img-top"
                    alt="Item"
                    style={{ height: "200px", objectFit: "contain" }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p>{item.description}</p>

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

      {/* MODAL */}
      {selectedItem && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedItem.title}</h5>
                <button className="close" onClick={() => setSelectedItem(null)}>
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <img
                  src={selectedItem.imageUrl || defaultImage}
                  className="img-fluid mb-3"
                  alt=""
                />

                {qrData.token && qrData.itemId === selectedItem._id && (
                  <div className="text-center">
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
                <button className="btn btn-primary" onClick={() => generateQR(selectedItem._id)}>
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
