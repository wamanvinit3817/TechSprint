export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const text = await res.text();
  console.log("API STATUS:", res.status);
  console.log("API RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text || "API error");
  }

  return text ? JSON.parse(text) : {};
};
