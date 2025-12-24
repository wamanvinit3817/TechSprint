import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-item.png";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const [orgName, setOrgName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // 🔐 QR state scoped to item
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

      setQrData({
        itemId,
        token: res.qrToken
      });
    } catch (err) {
      alert(err.message);
    }
  };

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
  apiFetch("http://localhost:5000/auth/me")
    .then((data) => setOrgName(data.name))
    .catch(() => setOrgName(""));
}, []);
const [me, setMe] = useState(null);

useEffect(() => {
  apiFetch("http://localhost:5000/auth/me")
    .then((data) => setMe(data))
    .catch(() => {});
}, []);

  // Lock background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "auto";
  }, [selectedItem]);

const filteredItems = items.filter((item) => {
  if (item.status === "claimed") return false;

  const matchesType =
    filter === "all" || item.type === filter;

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
  {/* LEFT */}
  <a className="navbar-brand" href="#" style={{fontSize:"1rem"}}>
    Findora
  </a>

  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
      <button
        className="nav-link btn btn-link"
        onClick={() => setFilter("all")}
        style={{fontSize:"0.8rem"}}
      >
        All
      </button>
    </li>
    <li className="nav-item">
      <button
        className="nav-link btn btn-link text-danger"
        onClick={() => setFilter("lost")}
         style={{fontSize:"0.8rem"}}
      >
        Lost
      </button>
    </li>
    <li className="nav-item">
      <button
        className="nav-link btn btn-link text-success"
        onClick={() => setFilter("found")}
         style={{fontSize:"0.8rem"}}
      >
        Found
      </button>
    </li>
  </ul>

  {/* CENTER SEARCH */}
  <form
    className="form-inline mx-auto"
    onSubmit={(e) => e.preventDefault()}
  >
    <input
      className="form-control mr-2"
      type="search"
      placeholder="Search items..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ width: "200px" }}
    />
    <button className="btn btn-outline-success"  style={{fontSize:"0.8rem"}}> 
      Search
    </button>
  </form>

  {/* RIGHT */}
  <div className="d-flex align-items-center">
    {me?.organization?.name && (
      <span className="badge bg-dark text-white mr-3 px-3 py-2">
        {me?.organization?.name}
      </span>
    )}

    <button
      className="btn btn-outline-primary mr-2"
      onClick={() => navigate("/add-item")}
       style={{fontSize:"0.8rem"}}
    >
      + Add Item
    </button>

    <button
      className="btn btn-outline-secondary mr-2"
      onClick={() => navigate("/history")}
       style={{fontSize:"0.8rem"}}
    >
      My Items
    </button>

    <button
      className="btn btn-outline-danger"
      onClick={handleLogout}
       style={{fontSize:"0.8rem"}}
    >
      Logout
    </button>
   {me && (
  <div className="text-right ml-3">
    <div style={{ fontSize: "0.7rem", fontWeight: 500 }}>
      👤 {me.user?.name}
    </div>
    {/* <div style={{ fontSize: "0.75rem", color: "#666" }}>
      {me.organization?.name}
    </div> */}
  </div>
)}
  </div>
</nav>

      {/* CONTENT */}
      <div className="container mt-4">
        {filteredItems.length === 0 ? (
          <div className="alert alert-info">
            No matching items found
          </div>
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
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{item.title}</h5>
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
                    <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
  Posted by: <strong>{item.postedBy?.name}</strong>
</p>

                    <p className="card-text">{item.description}</p>
                    <p className="text-muted mb-2"><i class="fa-solid fa-location-dot"></i>{item.location}</p>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary w-50 mx-2"
                        onClick={() => setSelectedItem(item)}
                      >
                        View Details
                      </button>

                     
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedItem.title}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setSelectedItem(null);
                    setQrData({ itemId: null, token: null });
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <img
                  src={selectedItem.imageUrl || defaultImage}
                  alt="Item"
                  className="img-fluid mb-3"
                />

                <span
                  className={`badge mb-2 ${
                    selectedItem.type === "lost"
                      ? "bg-danger"
                      : "bg-success"
                  }`}
                >
                  {selectedItem.type.toUpperCase()}
                </span>

                <p className="mt-2">{selectedItem.description}</p>
                <p className="text-muted"><i class="fa-solid fa-location-dot"></i> {selectedItem.location}</p>
               {selectedItem.type === "found" && selectedItem.founderContact && (
                  <div className="alert alert-info mt-3">
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
                      <p className="text-muted mt-2">
                        Ask the owner to scan this QR (valid for 5 minutes)
                      </p>
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
