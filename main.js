(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js-motion");

  const paths = {
    hire: {
      label: "01 / FOR BUSINESSES",
      description: "Bring the problem. We’ll help you find a practical next step—from content and services to software and execution.",
      action: "Talk about your project",
      href: "mailto:chayson@niterun.com?subject=NITERUN%20business%20request"
    },
    earn: {
      label: "02 / FOR PEOPLE",
      description: "Explore ways to contribute, practice useful skills and discover work. Availability and payout terms should always be verified first.",
      action: "See available opportunities",
      href: "https://niterun.com/opportunities"
    },
    build: {
      label: "03 / FOR BUILDERS",
      description: "Take an idea beyond the first draft. Build the website, the workflow and the operating system—and measure what actually works.",
      action: "Explore building with us",
      href: "https://niterun.com/business-starter"
    }
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tabs = Array.from(document.querySelectorAll(".hero-path"));
  const slides = Array.from(document.querySelectorAll(".hero-photo"));
  const position = document.querySelector(".hero-position");
  const description = document.getElementById("hero-description");
  const action = document.getElementById("hero-action");
  const actionText = document.getElementById("hero-action-text");
  const copyZone = document.querySelector(".hero-copy-content");
  let active = "hire";
  let switchToken = 0;

  function setPath(key, focus = false) {
    if (!Object.prototype.hasOwnProperty.call(paths, key)) return;
    const config = paths[key];
    if (key === active && !focus) return;
    active = key;
    const token = ++switchToken;

    tabs.forEach(tab => {
      const selected = tab.dataset.path === key;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus({ preventScroll: true });
    });

    slides.forEach(photo => {
      const selected = photo.dataset.photo === key;
      photo.classList.toggle("is-active", selected);
      photo.setAttribute("aria-hidden", String(!selected));
      if (selected) photo.loading = "eager";
    });

    const commit = () => {
      if (token !== switchToken) return;
      position.textContent = config.label;
      description.textContent = config.description;
      actionText.textContent = config.action;
      action.href = config.href;
      if (config.href.startsWith("https://")) {
        action.target = "_blank";
        action.rel = "noopener noreferrer";
      } else {
        action.removeAttribute("target");
        action.removeAttribute("rel");
      }
      copyZone.classList.remove("is-changing");
    };

    if (reduced.matches) commit();
    else {
      copyZone.classList.add("is-changing");
      window.setTimeout(commit, 145);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setPath(tab.dataset.path, false));
    tab.addEventListener("keydown", event => {
      const key = event.key;
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
      event.preventDefault();
      const nextIndex = key === "Home" ? 0 : key === "End" ? tabs.length - 1
        : (index + (key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      setPath(tabs[nextIndex].dataset.path, true);
    });
  });

  const workRows = Array.from(document.querySelectorAll("[data-work-row]"));
  function setWorkRow(row) {
    const target = row.querySelector(".work-row-trigger");
    const opening = target.getAttribute("aria-expanded") !== "true";
    workRows.forEach(entry => {
      const trigger = entry.querySelector(".work-row-trigger");
      const panel = entry.querySelector(".work-row-panel");
      const open = entry === row && opening;
      entry.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      entry.querySelector(".work-row-state").textContent = open ? "CLOSE" : "DETAILS";
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      panel.querySelectorAll("a,button,input,select,textarea").forEach(el => {
        if (open) el.removeAttribute("tabindex");
        else el.tabIndex = -1;
      });
    });
  }

  workRows.forEach(entry => {
    entry.querySelector(".work-row-trigger").addEventListener("click", () => setWorkRow(entry));
  });
  workRows.forEach(entry => {
    const visible = entry.classList.contains("is-open");
    entry.querySelectorAll(".work-row-panel a").forEach(a => { if (!visible) a.tabIndex = -1; });
  });

  const header = document.getElementById("site-header");
  const progress = document.querySelector(".scroll-progress-fill");
  let scheduled = false;
  function updateScroll() {
    header.classList.toggle("scrolled", window.scrollY > 48);
    const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, window.scrollY / height)) + ")";
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();

  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-navigation");
  function setMenu(open) {
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".menu-button-label").textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("menu-open", open);
    header.classList.toggle("menu-open", open);
  }
  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });
  const breakpoint = window.matchMedia("(min-width: 851px)");
  breakpoint.addEventListener("change", event => { if (event.matches) setMenu(false); });

  const revealTargets = document.querySelectorAll(".section-reveal");
  if ("IntersectionObserver" in window && !reduced.matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -55px 0px" });
    revealTargets.forEach(target => io.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add("is-visible"));
  }
  reduced.addEventListener("change", event => {
    if (event.matches) revealTargets.forEach(target => target.classList.add("is-visible"));
  });
})();