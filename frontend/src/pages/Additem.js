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
    <div className="app-background">
      <div className="glass-card add-item-card">

        {/* 🔴 CLOSE BUTTON (TOP RIGHT) */}
        <button
          type="button"
          className="additem-close"
          onClick={() => navigate("/dashboard")}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="page-title">Add Lost / Found Item</h2>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <label>Title</label>
          <input
            name="title"
            placeholder="Enter item title"
            required
            onChange={handleChange}
          />

          {/* DESCRIPTION */}
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the item"
            rows="4"
            required
            onChange={handleChange}
          />

          {/* TYPE */}
          <label>Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          {/* LOCATION */}
          <label>
            {form.type === "lost"
              ? "Where did you lose it?"
              : "Where did you find it?"}
          </label>
          <input
            name="location"
            placeholder="Location"
            required
            onChange={handleChange}
          />

          {/* CONTACT (FOUND ONLY) */}
          {form.type === "found" && (
            <>
              <label>How can the owner contact you?</label>
              <input
                name="founderContact"
                placeholder="Phone / Hostel / Instructions"
                required
                onChange={handleChange}
              />
            </>
          )}

          {/* IMAGE */}
          <label>Item Photo (optional)</label>
          <div className="file-upload-wrapper">
  <label className="file-upload-btn">
    Upload Image
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) =>
        setForm({ ...form, image: e.target.files[0] })
      }
    />
  </label>

  <span className="file-name">
    {form.image ? form.image.name : "No file selected"}
  </span>
</div>

          <button className="primary-btn" type="submit">
            Post Item
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddItem;
