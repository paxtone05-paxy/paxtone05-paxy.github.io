const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const introScreen = document.querySelector("#intro-screen");
const introSkip = document.querySelector("#intro-skip");
const heroArt = document.querySelector(".hero-art");
const radioPlayer = document.querySelector("#radio-player");
const radioDragHandle = document.querySelector("#radio-drag-handle");
const radioToggle = document.querySelector("#radio-toggle");
const radioContent = document.querySelector("#radio-content");

document.body.classList.add("intro-active");

let introDismissed = false;
const dismissIntro = () => {
  if (introDismissed) return;
  introDismissed = true;
  introScreen.classList.add("is-leaving");
  window.setTimeout(() => {
    introScreen.remove();
    document.body.classList.remove("intro-active");
  }, 700);
};

introSkip.addEventListener("click", dismissIntro);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !introDismissed) dismissIntro();
});
window.setTimeout(dismissIntro, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1600);

let scrollFrame = 0;
const updateUniverseParallax = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    const heroTop = document.querySelector("#home").getBoundingClientRect().top;
    const offset = Math.max(-55, Math.min(55, -heroTop * 0.12));
    heroArt.style.setProperty("--universe-scroll", `${offset}px`);
    scrollFrame = 0;
  });
};

window.addEventListener("scroll", updateUniverseParallax, { passive: true });
window.addEventListener("resize", () => {
  updateUniverseParallax();
  if (!radioPlayer.style.left || !radioPlayer.style.top) return;
  const bounds = radioPlayer.getBoundingClientRect();
  radioPlayer.style.left = `${Math.max(12, Math.min(window.innerWidth - radioPlayer.offsetWidth - 12, bounds.left))}px`;
  radioPlayer.style.top = `${Math.max(12, Math.min(window.innerHeight - radioPlayer.offsetHeight - 12, bounds.top))}px`;
});
updateUniverseParallax();

radioToggle.addEventListener("click", () => {
  const isExpanded = radioToggle.getAttribute("aria-expanded") === "true";
  radioToggle.setAttribute("aria-expanded", String(!isExpanded));
  radioToggle.setAttribute("aria-label", isExpanded ? "Expand radio" : "Minimize radio");
  radioToggle.textContent = isExpanded ? "+" : "−";
  radioContent.hidden = isExpanded;
});

let dragState = null;
radioDragHandle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && event.pointerType === "mouse") return;
  const bounds = radioPlayer.getBoundingClientRect();
  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    left: bounds.left,
    top: bounds.top,
  };
  radioPlayer.classList.add("is-dragging");
  radioPlayer.style.left = `${bounds.left}px`;
  radioPlayer.style.top = `${bounds.top}px`;
  radioPlayer.style.right = "auto";
  radioPlayer.style.bottom = "auto";
  radioDragHandle.setPointerCapture(event.pointerId);
  event.preventDefault();
});

radioDragHandle.addEventListener("pointermove", (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const deltaX = event.clientX - dragState.startX;
  const deltaY = event.clientY - dragState.startY;
  const maxLeft = window.innerWidth - radioPlayer.offsetWidth - 12;
  const maxTop = window.innerHeight - radioPlayer.offsetHeight - 12;
  radioPlayer.style.left = `${Math.max(12, Math.min(maxLeft, dragState.left + deltaX))}px`;
  radioPlayer.style.top = `${Math.max(12, Math.min(maxTop, dragState.top + deltaY))}px`;
});

const finishRadioDrag = (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  dragState = null;
  radioPlayer.classList.remove("is-dragging");
};

radioDragHandle.addEventListener("pointerup", finishRadioDrag);
radioDragHandle.addEventListener("pointercancel", finishRadioDrag);
radioDragHandle.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 32 : 12;
  const bounds = radioPlayer.getBoundingClientRect();
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  radioPlayer.style.left = `${Math.max(12, Math.min(window.innerWidth - radioPlayer.offsetWidth - 12, bounds.left + move[0]))}px`;
  radioPlayer.style.top = `${Math.max(12, Math.min(window.innerHeight - radioPlayer.offsetHeight - 12, bounds.top + move[1]))}px`;
  radioPlayer.style.right = "auto";
  radioPlayer.style.bottom = "auto";
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }
});

document.querySelector("#copyright-year").textContent = new Date().getFullYear();

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const subject = `Portfolio enquiry from ${formData.get("name")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    "Project details:",
    formData.get("message"),
  ].join("\n");
  const mailto = `mailto:prayagvaishnav30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector("#form-note").textContent = "Your email app is opening with your enquiry ready to send.";
  window.location.href = mailto;
});