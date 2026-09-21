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

/* ---- Scroll reveal (ported from the Nestre marketing site) ----
   Plain scroll + resize listener with a rect check — reliable after nav,
   reveals above-the-fold on load, self-removes when nothing's left. */
(function () {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (reduced) return;
  document.documentElement.classList.add("armed");

  const cardSel = ".jcard, .experience-media, .about-media, .seasonal-media, .brow-media";
  const tagged = [...document.querySelectorAll("[data-reveal]")];

  // Stagger index: cards restart within their own grid; text cascades globally (cap 12).
  tagged.forEach((el, i) => {
    const isCard = el.matches(cardSel);
    const idx = isCard
      ? [...el.parentElement.children].filter((c) => c.matches(cardSel)).indexOf(el)
      : Math.min(i, 12);
    el.style.setProperty("--i", String(idx < 0 ? 0 : idx));
  });

  const reveal = () => {
    const vh = window.innerHeight;
    let remaining = false;
    for (const el of tagged) {
      if (el.classList.contains("in")) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("in");
      else remaining = true;
    }
    if (!remaining) window.removeEventListener("scroll", reveal);
  };
  reveal();
  window.addEventListener("scroll", reveal, { passive: true });
  window.addEventListener("resize", reveal);
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
