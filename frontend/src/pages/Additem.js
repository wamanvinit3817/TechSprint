import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
    founderContact: "",
    image: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("location", form.location);

    // ✅ only attach contact for FOUND items
    if (form.type === "found") {
      formData.append("founderContact", form.founderContact);
    }

    if (form.image) {
      formData.append("image", form.image);
    }

    await fetch("http://localhost:5000/api/items/additem", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    navigate("/dashboard");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Add Lost / Found Item</h3>

      <form onSubmit={handleSubmit} className="card p-4">
        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            required
            onChange={handleChange}
          />
        </div>

        {/* TYPE */}
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={form.type}
            onChange={handleChange}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* LOCATION */}
        {form.type === "found" &&(
        <div className="mb-3">
          <label className="form-label">Where did you find it?</label>
          <input
            name="location"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
        )}
         {form.type === "lost" && (
        <div className="mb-3">
          <label className="form-label">Where did you lose it?</label>
          <input
            name="location"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
        )}

        {/* ✅ CONTACT INFO (FOUND ONLY) */}
        {form.type === "found" && (
          <div className="mb-3">
            <label className="form-label">
              How can the owner contact you?
            </label>
            <input
              name="founderContact"
              className="form-control"
              placeholder="Phone / Hostel / Any instructions"
              required
              onChange={handleChange}
            />
          </div>
        )}

        {/* IMAGE */}
        <div className="mb-3">
          <label className="form-label">Item Photo (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />
        </div>

        <button className="btn btn-success">
          Post Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
