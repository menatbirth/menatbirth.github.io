const links = [...document.querySelectorAll(".terminal-nav a")];
const nav = document.querySelector(".terminal-nav");
const statusLine = document.querySelector(".status-line");
let activeIndex = 0;
let ready = false;

function select(index) {
  activeIndex = (index + links.length) % links.length;

  links.forEach((link, currentIndex) => {
    const active = currentIndex === activeIndex;
    link.classList.toggle("is-active", active);
    link.querySelector(".prompt").textContent = active ? ">" : "\u00a0";
  });
}

function restoreSession() {
  if (ready) return;
  ready = true;
  statusLine.textContent = "ACCESS GRANTED";
  statusLine.classList.add("status-line--done");
  document.querySelector(".prompt-label").classList.add("prompt-label--ready");
  nav.classList.add("terminal-nav--ready");
}

const restoreTimer = window.setTimeout(restoreSession, 850);

window.addEventListener(
  "pointerdown",
  () => {
    window.clearTimeout(restoreTimer);
    restoreSession();
  },
  { once: true },
);

window.addEventListener("keydown", (event) => {
  if (!ready) {
    window.clearTimeout(restoreTimer);
    restoreSession();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    select(activeIndex + 1);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    select(activeIndex - 1);
  }

  if (event.key === "Enter") {
    links[activeIndex].click();
  }
});

links.forEach((link, index) => {
  link.addEventListener("mouseenter", () => select(index));
  link.addEventListener("focus", () => select(index));
});
