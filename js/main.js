const navMap = {
  "index.html": "nav-index",
  "vung-mien.html": "nav-vung-mien",
  "thuc-don.html": "nav-thuc-don",
  "nguyen-lieu.html": "nav-nguyen-lieu",
  "cong-thuc.html": "nav-cong-thuc",
  "duong-pho.html": "nav-duong-pho",
  "lich-su.html": "nav-lich-su",
  "lien-he.html": "nav-lien-he"
};

const toggleMobileMenu = () => {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileMenuOverlay");

  if (!menu || !overlay) {
    return;
  }

  const isOpen = menu.classList.toggle("is-open");
  overlay.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("is-locked", isOpen);
};

const closeMobileMenu = () => {
  document.getElementById("mobileMenu")?.classList.remove("is-open");
  document.getElementById("mobileMenuOverlay")?.classList.remove("is-open");
  document.body.classList.remove("is-locked");
};

const setActiveNavigation = () => {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const activeId = navMap[page];

  if (!activeId) {
    return;
  }

  document.getElementById(activeId)?.classList.add("is-active");
  document
    .querySelector(`#mobileMenu a[href="${page}"]`)
    ?.classList.add("is-active");
};

const setupReveal = () => {
  const items = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
};

const setupMenuTabs = () => {
  const sections = document.querySelectorAll(".menu-section");
  const tabs = document.querySelectorAll(".menu-tabs a");

  if (!sections.length || !tabs.length) {
    return;
  }

  const activate = () => {
    const currentTop = window.scrollY + 170;

    sections.forEach((section) => {
      const isCurrent = section.offsetTop <= currentTop
        && section.offsetTop + section.offsetHeight > currentTop;

      if (!isCurrent) {
        return;
      }

      tabs.forEach((tab) => {
        tab.classList.toggle("is-active", tab.getAttribute("href") === `#${section.id}`);
      });
    });
  };

  window.addEventListener("scroll", activate, { passive: true });
  tabs.forEach((tab) => tab.addEventListener("click", activate));
  activate();
};

const setupCardLinks = () => {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    const navigate = () => {
      window.location.href = card.dataset.cardLink;
    };

    card.addEventListener("click", navigate);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigate();
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-menu-toggle]").forEach((trigger) => {
    trigger.addEventListener("click", toggleMobileMenu);
  });

  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  setActiveNavigation();
  setupReveal();
  setupMenuTabs();
  setupCardLinks();
});
