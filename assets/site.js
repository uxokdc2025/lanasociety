/* ============================================================
   Lana Society — shared site behavior
   ============================================================ */

/* -----------------------------------------------------------
   BOOKING
   Square Appointments booking site link.
   Drop Alana's public booking URL here (Square Dashboard →
   Appointments → Online Booking → Booking Site) and every
   "Book" button across the site goes live instantly.
   Leave empty ("") until it exists — buttons fall back to the
   contact section so nothing dead-ends.
----------------------------------------------------------- */
const BOOKING_URL = ""; // e.g. "https://book.squareup.com/appointments/xxxxxxxx/location/yyyyyyyy"

function book() {
  closeMobileMenu();
  if (BOOKING_URL && /^https?:\/\//.test(BOOKING_URL)) {
    window.open(BOOKING_URL, "_blank", "noopener");
  } else {
    const el = document.getElementById("contact");
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    } else {
      window.location.href = "index.html#contact";
    }
  }
}

/* ---- Scroll reveal ---- */
(function () {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (reduced) return;
  document.documentElement.classList.add("armed");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  const vh = window.innerHeight;
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    // Reveal above-the-fold content immediately (no blank flash); observe the rest.
    if (el.getBoundingClientRect().top < vh * 0.9) {
      el.classList.add("in");
    } else {
      io.observe(el);
    }
  });
})();

/* ---- Nav: solid on scroll ---- */
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ---- Mobile menu ---- */
let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById("mobile-menu").classList.toggle("open", menuOpen);
  document.body.style.overflow = menuOpen ? "hidden" : "";
}
function closeMobileMenu() {
  menuOpen = false;
  const m = document.getElementById("mobile-menu");
  if (m) m.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Contact form (Web3Forms) ---- */
async function submitContact(e) {
  e.preventDefault();
  const btn = document.getElementById("contact-btn");
  btn.disabled = true;
  btn.textContent = "Sending…";
  try {
    const data = new FormData(document.getElementById("contact-form"));
    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
    const json = await res.json();
    if (json.success) {
      document.getElementById("contact-form").classList.add("hidden");
      document.getElementById("contact-success").classList.remove("hidden");
    } else {
      throw new Error(json.message);
    }
  } catch {
    btn.disabled = false;
    btn.textContent = "Send note";
    document.getElementById("contact-error").classList.remove("hidden");
  }
}

/* ---- Esc closes overlays ---- */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});
