const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const introScreen = document.querySelector("#intro-screen");
const introSkip = document.querySelector("#intro-skip");
const heroArt = document.querySelector(".hero-art");
const radioPlayer = document.querySelector("#radio-player");
const radioDragHandle = document.querySelector("#radio-drag-handle");
const radioToggle = document.querySelector("#radio-toggle");
const radioContent = document.querySelector("#radio-content");
const radioTrackSelect = document.querySelector("#radio-track-select");
const radioTrackTitle = document.querySelector("#radio-track-title");
const radioTrackArtist = document.querySelector("#radio-track-artist");
const radioTrackCount = document.querySelector("#radio-track-count");
const radioTrackArt = document.querySelector("#radio-track-art");
const radioPrevious = document.querySelector("#radio-previous");
const radioNext = document.querySelector("#radio-next");
const radioAudio = document.querySelector("#radio-audio");
const radioPlayPause = document.querySelector("#radio-play-pause");
const radioSeek = document.querySelector("#radio-seek");
const radioCurrentTime = document.querySelector("#radio-current-time");
const radioDuration = document.querySelector("#radio-duration");
const radioNote = document.querySelector("#radio-note");

const radioTracks = [
  {
    title: "Feel It",
    artist: "Michele Morrone",
    src: "assets/audio/feel-it.mp3",
    art: "F",
  },
  {
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    src: "assets/audio/stay.mp3",
    art: "S",
  },
];

let currentRadioTrack = 0;
const formatAudioTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const updateRadioPlayButton = () => {
  const isPlaying = !radioAudio.paused;
  radioPlayPause.textContent = isPlaying ? "Ⅱ" : "▶";
  radioPlayPause.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${radioTracks[currentRadioTrack].title}`);
  radioPlayer.classList.toggle("is-playing", isPlaying);
};

const playRadioTrack = async () => {
  try {
    await radioAudio.play();
    radioNote.textContent = "Now playing on PvX Radio.";
  } catch {
    radioNote.textContent = "Playback could not start. Press play to try again.";
  }
};

const selectRadioTrack = (index, shouldPlay = !radioAudio.paused) => {
  currentRadioTrack = (index + radioTracks.length) % radioTracks.length;
  const track = radioTracks[currentRadioTrack];
  radioTrackSelect.value = String(currentRadioTrack);
  radioTrackTitle.textContent = track.title;
  radioTrackArtist.textContent = track.artist;
  radioTrackCount.textContent = `${String(currentRadioTrack + 1).padStart(2, "0")} / ${String(radioTracks.length).padStart(2, "0")} · YOUR QUEUE`;
  radioTrackArt.textContent = track.art;
  radioAudio.src = track.src;
  radioAudio.load();
  radioSeek.value = "0";
  radioSeek.disabled = true;
  radioCurrentTime.textContent = "0:00";
  radioDuration.textContent = "0:00";
  radioNote.textContent = "Choose a song and press play.";
  updateRadioPlayButton();
  if (shouldPlay) playRadioTrack();
};

radioTrackSelect.addEventListener("change", () => {
  selectRadioTrack(Number(radioTrackSelect.value), !radioAudio.paused);
});
radioPrevious.addEventListener("click", () => selectRadioTrack(currentRadioTrack - 1));
radioNext.addEventListener("click", () => selectRadioTrack(currentRadioTrack + 1));
radioPlayPause.addEventListener("click", () => {
  if (radioAudio.paused) {
    playRadioTrack();
  } else {
    radioAudio.pause();
  }
});
radioAudio.addEventListener("loadedmetadata", () => {
  radioSeek.disabled = false;
  radioSeek.value = "0";
  radioDuration.textContent = formatAudioTime(radioAudio.duration);
});
radioAudio.addEventListener("timeupdate", () => {
  radioCurrentTime.textContent = formatAudioTime(radioAudio.currentTime);
  if (Number.isFinite(radioAudio.duration) && radioAudio.duration > 0) {
    radioSeek.value = String((radioAudio.currentTime / radioAudio.duration) * 100);
  }
});
radioSeek.addEventListener("input", () => {
  if (!Number.isFinite(radioAudio.duration) || radioAudio.duration <= 0) return;
  radioAudio.currentTime = (Number(radioSeek.value) / 100) * radioAudio.duration;
});
radioAudio.addEventListener("play", updateRadioPlayButton);
radioAudio.addEventListener("pause", updateRadioPlayButton);
radioAudio.addEventListener("ended", () => selectRadioTrack(currentRadioTrack + 1, true));
radioAudio.addEventListener("error", () => {
  radioNote.textContent = "This track could not be loaded. Please try again.";
  updateRadioPlayButton();
});

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