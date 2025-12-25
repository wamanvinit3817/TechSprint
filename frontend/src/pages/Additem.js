import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import GlobalAlert from "./GlobalAlert";

function AddItem() {
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useAlert();
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

  try {
    setSubmitting(true)
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("location", form.location);



   if (!form.title.trim()) {
    showAlert("warning", "Title is required");
    return;
  }

  if (!form.description.trim()) {
    showAlert("warning", "Description is required");
    return;
  }

  if (!form.location.trim()) {
    showAlert("warning", "Location is required");
    return;
  }

  if (form.type === "found" && !form.founderContact.trim()) {
    showAlert("warning", "Contact information is required");
    return;
  }

    if (form.type === "found") {
      formData.append("founderContact", form.founderContact);
    }

    if (form.image) {
      formData.append("image", form.image);
    }

    const res = await fetch("http://localhost:5000/api/items/additem", {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to post item");
    }
     showAlert("success", "Item posted successfully");
    navigate("/dashboard");
  } catch (err) {
    if (err.message === "duplicate_item") {
    showAlert("warning", "You already posted a similar item");
  } else {
    showAlert("danger", "Failed to post item");
  }
  }finally{
    setSubmitting(false)
  }
};

 return (
  <div className="additem-page container mt-4">
   <div className="additem-header">
  <h3>Add Lost / Found Item</h3>

  <button
    className="additem-back-btn"
    onClick={() => navigate("/dashboard")}
  >
    ← Back
  </button>
</div>


    <GlobalAlert />

    <form onSubmit={handleSubmit} className="additem-card card p-4">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          name="title"
          className="form-control"
          
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          
          onChange={handleChange}
        />
      </div>

     <div className="additem-type mb-3">
  <label className="additem-label">Type</label>

  <select
    name="type"
    className="additem-select"
    value={form.type}
    onChange={handleChange}
  >
    <option value="lost">Lost</option>
    <option value="found">Found</option>
  </select>
</div>


      <div className="mb-3">
        <label className="form-label">
          {form.type === "lost"
            ? "Where did you lose it?"
            : "Where did you find it?"}
        </label>
        <input
          name="location"
          className="form-control"
         
          onChange={handleChange}
        />
      </div>

      {form.type === "found" && (
        <div className="mb-3">
          <label className="form-label">
            How can the owner contact you?
          </label>
          <input
            name="founderContact"
            className="form-control"
           
            onChange={handleChange}
          />
        </div>
      )}

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

      <button className="btn btn-success additem-submit">
         {submitting ? "Posting..." : "Post Item"}
      </button>
    </form>
  </div>
);


}

export default AddItem;
