export const toggleTheme = () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  document.body.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
};

export const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
};
