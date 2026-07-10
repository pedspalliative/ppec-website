// Mobile nav toggle
(function () {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    });
  });
})();

// Contact form prefill — reads ?interest= from URL on load and prefills
// the dropdown + message starter. Also keeps the message in sync when the
// user changes the dropdown, as long as they haven't typed their own text.
(function () {
  const select = document.getElementById("interest");
  const message = document.getElementById("message");
  if (!select || !message) return;

  // Source of truth: dropdown option text → starter sentence.
  const starters = {
    "Education & Training":
      "We're exploring training for our team, looking at topics like [communication / goals of care / team dynamics] in a [half-day / multi-day / longitudinal] format. Our group is roughly [size and roles].",
    Consultation:
      "We're looking for consultation around [program development / a complex case / leadership and team dynamics]. Happy to share more on a discovery call.",
    Mentorship:
      "We're interested in mentorship support for [an individual provider / a small group / a team in transition]. Would love to learn how it typically works.",
    "Just exploring":
      "Hi! I came across PPEC and wanted to learn more about your work. [A sentence about my role, my team, or what drew me in.]",
  };

  // URL param → dropdown option (kept short so links stay tidy).
  const urlAlias = {
    training: "Education & Training",
    consultation: "Consultation",
    mentorship: "Mentorship",
    explore: "Just exploring",
  };

  const knownStarters = new Set(Object.values(starters));

  function setOption(optionText) {
    Array.from(select.options).forEach((o) => {
      o.selected = o.text === optionText;
    });
  }

  // Replace the message only if it's empty or still showing one of our
  // starter templates (i.e. the user hasn't started writing their own).
  function setStarterIfSafe(optionText) {
    const current = message.value.trim();
    if (current === "" || knownStarters.has(current)) {
      message.value = starters[optionText] || "";
    }
  }

  // Initial prefill from ?interest= on page load.
  const interest = new URLSearchParams(location.search).get("interest");
  const initialOption = urlAlias[interest];
  if (initialOption) {
    setOption(initialOption);
    setStarterIfSafe(initialOption);
  }

  // Keep the message in sync when the dropdown changes.
  select.addEventListener("change", () => {
    setStarterIfSafe(select.value);
  });
})();

// Team bios — click a photo or "Read full bio" to open a center-peek modal.
(function () {
  const modal = document.getElementById("bio-modal");
  if (!modal) return;
  const panel = modal.querySelector(".bio-modal__panel");
  const body = modal.querySelector(".bio-modal__body");
  const closeBtn = modal.querySelector(".bio-modal__close");
  let lastTrigger = null;

  function open(bioId) {
    const source = document.getElementById("bio-" + bioId);
    if (!source) return;
    body.innerHTML = source.innerHTML;
    const name = source.querySelector(".bio-modal__name");
    modal.setAttribute("aria-label", name ? name.textContent.trim() : "Bio");
    modal.hidden = false;
    document.body.classList.add("bio-open");
    panel.scrollTop = 0;
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("bio-open");
    body.innerHTML = "";
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-bio]").forEach((el) => {
    el.addEventListener("click", () => {
      lastTrigger = el;
      open(el.getAttribute("data-bio"));
    });
  });

  modal.querySelectorAll("[data-bio-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
