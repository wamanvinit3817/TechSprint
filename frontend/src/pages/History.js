import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import defaultImage from "../assets/default-item.png";
import { useNavigate } from "react-router-dom";

function History() {
  const [tab, setTab] = useState("posted");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const url =
      tab === "posted"
        ? "http://localhost:5000/api/items/my-posted"
        : "http://localhost:5000/api/items/my-claimed";

    apiFetch(url)
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Items</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      {/* TABS */}
      <div className="btn-group mb-4">
        <button
          className={` mx-2 btn btn-outline-primary ${
            tab === "posted" ? "active" : ""
          }`}
          onClick={() => setTab("posted")}
        >
          My Posted Items
        </button>

        <button
          className={`btn btn-outline-success ${
            tab === "claimed" ? "active" : ""
          }`}
          onClick={() => setTab("claimed")}
        >
          My Claimed Items
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="alert alert-info">
          No items found in this section
        </div>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card h-100">
                <img
                  src={item.imageUrl || defaultImage}
                  className="card-img-top"
                  alt="Item"
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>{item.title}</h6>
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

                  <p className="text-muted mb-1">
                    <i class="fa-solid fa-location-dot"></i> {item.location}
                  </p>

                  <span
                    className={`badge ${
                      item.status === "claimed"
                        ? "bg-secondary"
                        : "bg-primary"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
