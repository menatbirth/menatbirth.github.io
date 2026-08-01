let savedTheme = null;
try {
  savedTheme = localStorage.getItem("peakpark-theme");
} catch (_) {
  // The theme still works when storage is unavailable.
}
const initialTheme = savedTheme === "light" ? "light" : "dark";
document.documentElement.dataset.theme = initialTheme;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("peakpark-theme", theme);
  } catch (_) {
    // Ignore storage restrictions in private or local-file browsing modes.
  }

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    const selected = button.dataset.themeChoice === theme;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(document.documentElement.dataset.theme);
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
  });
});
