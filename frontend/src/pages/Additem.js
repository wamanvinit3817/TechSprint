import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { apiFetch } from "../utils/api";

function AddItem() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [submitting, setSubmitting] = useState(false);

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

  try {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("location", form.location);

    if (form.image) formData.append("image", form.image);
    if (form.type === "found") {
      formData.append("founderContact", form.founderContact);
    }

    // ✅ if apiFetch resolves, request was successful
    await apiFetch("http://localhost:5000/api/items/additem", {
      method: "POST",
      body: formData
    });

    showAlert("success", "Item posted successfully!");
    navigate("/dashboard");

  } catch (err) {
    console.error(err);

    if (err.message === "duplicate_item") {
      showAlert(
        "warning",
        "You already posted this item at the same location."
      );
    } else {
      showAlert("danger", err.message || "Failed to add item");
    }

  } finally {
    setSubmitting(false);
  }
};





  return (
    <div className="app-background">
      <div className="glass-card add-item-card">
        <button
          className="additem-close"
          onClick={() => navigate("/dashboard")}
        >
          ×
        </button>

        <h2 className="page-title">Add Lost / Found Item</h2>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            required
            value={form.description}
            onChange={handleChange}
          />

          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <label>
            {form.type === "lost"
              ? "Where did you lose it?"
              : "Where did you find it?"}
          </label>
          <input
            name="location"
            required
            value={form.location}
            onChange={handleChange}
          />

          {form.type === "found" && (
            <>
              <label>How can the owner contact you?</label>
              <input
                name="founderContact"
                value={form.founderContact}
                onChange={handleChange}
              />
            </>
          )}

    <label className="choose-file-label">Item Photo (optional)</label>
<input
  type="file"
  className="choose-file"
  accept="image/*"
  onChange={(e) =>
    setForm({ ...form, image: e.target.files[0] })
  }
/>


          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
