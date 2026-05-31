document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("mobileNav");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const navClose = document.querySelector("[data-nav-close]");
    const yearTargets = document.querySelectorAll("[data-current-year]");

    yearTargets.forEach((target) => {
        target.textContent = String(new Date().getFullYear());
    });

    const setNavState = (isOpen) => {
        if (!nav || !navToggle) return;
        nav.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("nav-open", isOpen);
        nav.setAttribute("aria-hidden", String(!isOpen));
        navToggle.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) {
            const firstLink = nav.querySelector("a, button");
            firstLink?.focus();
        } else {
            navToggle.focus();
        }
    };

    navToggle?.addEventListener("click", () => setNavState(true));
    navClose?.addEventListener("click", () => setNavState(false));

    nav?.addEventListener("click", (event) => {
        if (event.target === nav || event.target instanceof HTMLAnchorElement) {
            setNavState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav?.classList.contains("is-open")) {
            setNavState(false);
        }
    });

    const filterButtons = document.querySelectorAll("[data-menu-filter]");
    const menuItems = document.querySelectorAll("[data-category]");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-menu-filter") || "all";

            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            menuItems.forEach((item) => {
                const categories = (item.getAttribute("data-category") || "").split(" ");
                const isVisible = filter === "all" || categories.includes(filter);
                item.classList.toggle("is-hidden", !isVisible);
            });
        });
    });

    const reservationDate = document.getElementById("reservationDate");
    if (reservationDate instanceof HTMLInputElement) {
        const today = new Date();
        const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        reservationDate.min = offsetDate.toISOString().slice(0, 10);
    }

    const messages = {
        newsletter: "Đã ghi nhận email. Bản tin bếp Việt sẽ được gửi khi hệ thống email được kết nối.",
        reservation: "Yêu cầu đặt bàn đã được kiểm tra. Website tĩnh đang hiển thị xác nhận mẫu, vui lòng gọi 024 3826 7890 nếu cần giữ bàn ngay.",
        contact: "Tin nhắn đã được kiểm tra. Khi kết nối email/backend, nội dung này sẽ được gửi đến đội Âm Thực Việt."
    };

    document.querySelectorAll("[data-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!(form instanceof HTMLFormElement)) return;
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const type = form.getAttribute("data-form") || "contact";
            const status = form.querySelector("[data-form-status]");
            if (status) {
                status.textContent = messages[type] || messages.contact;
            }
            form.reset();
            if (reservationDate instanceof HTMLInputElement) {
                const today = new Date();
                const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
                reservationDate.min = offsetDate.toISOString().slice(0, 10);
            }
        });
    });
});
