// export async function apiFetch(url, options = {}) {
//   const token = localStorage.getItem("token");

//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.body instanceof FormData
//         ? {}
//         : { "Content-Type": "application/json" }),
//       Authorization: token ? `Bearer ${token}` : "",
//       ...(options.headers || {})
//     }
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error("Request Proceeded");
//   }

//   return data;
// }
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}
