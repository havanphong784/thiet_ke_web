const navMap = {
  "index.html": "navIndex",
  "vung-mien.html": "navVungMien",
  "thuc-don.html": "navThucDon",
  "nguyen-lieu.html": "navNguyenLieu",
  "cong-thuc.html": "navCongThuc",
  "duong-pho.html": "navDuongPho",
  "lich-su.html": "navLichSu",
  "lien-he.html": "navLienHe",
};

function setActiveNavigation() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const activeId = navMap[page];
  if (!activeId) return;

  const el = document.getElementById(activeId);
  if (el) el.classList.add("is-active");

  const mobileEl = document.querySelector(`#mobileMenu a[href="${page}"]`);
  if (mobileEl) mobileEl.classList.add("is-active");
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileMenuOverlay");
  if (!menu || !overlay) return;

  const isOpen = menu.classList.toggle("is-open");
  overlay.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("is-locked", isOpen);
}

function closeMobileMenu() {
  document.getElementById("mobileMenu")?.classList.remove("is-open");
  document.getElementById("mobileMenuOverlay")?.classList.remove("is-open");
  document.body.classList.remove("is-locked");
}

function setupReveal() {
  const items = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  items.forEach((item) => observer.observe(item));
}

function setupMenuTabs() {
  const sections = document.querySelectorAll(".menu-section");
  const tabs = document.querySelectorAll(".menu-tabs a");
  if (!sections.length || !tabs.length) return;

  function activateCurrentTab() {
    const scrollPos = window.scrollY + 170;
    sections.forEach((section) => {
      const inRange =
        section.offsetTop <= scrollPos &&
        section.offsetTop + section.offsetHeight > scrollPos;
      if (!inRange) return;

      tabs.forEach((tab) => {
        tab.classList.toggle(
          "is-active",
          tab.getAttribute("href") === `#${section.id}`,
        );
      });
    });
  }

  window.addEventListener("scroll", activateCurrentTab, { passive: true });
  tabs.forEach((tab) => tab.addEventListener("click", activateCurrentTab));
  activateCurrentTab();
}

function setupCardLinks() {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    const navigate = () => {
      window.location.href = card.dataset.cardLink;
    };
    card.addEventListener("click", navigate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch("components/header.html"),
      fetch("components/footer.html"),
    ]);

    if (headerRes.ok) {
      const headerHtml = await headerRes.text();
      const headerPlaceholder = document.getElementById("header-placeholder");
      if (headerPlaceholder) headerPlaceholder.outerHTML = headerHtml;
    }

    if (footerRes.ok) {
      const footerHtml = await footerRes.text();
      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) footerPlaceholder.outerHTML = footerHtml;
    }
  } catch (error) {
    console.error("Lỗi khi tải component:", error);
  }

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
