

export async function apiFetch(url, options = {}) {
   
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Something went wrong");
  }

  if (!res.ok) {
    // ❌ NEVER expose raw backend messages
    if (data?.error === "Not authorized") {
      throw new Error("unauthorized");
    }

    if (data?.error === "duplicate_item") {
      throw new Error("duplicate_item");
    }

    throw new Error("server_error");
  }

  return data;
}
