const revealSelectors = [
    '.section-intro',
    '.section-title',
    '.dishes-header',
    '.menu-section-header',
    '.region-card',
    '.dish-card',
    '.street-food-card',
    '.testimonial-card',
    '.flex-section__img',
    '.flex-section__content',
    '.ingredient-card',
    '.timeline-item',
    '.dark-quote blockquote',
    '.menu-tabs',
    '.menu-item-large',
    '.menu-item-side',
    '.menu-item-card',
    '.menu-item-quote',
    '.dessert-card',
    '.seasonal-card',
    '.contact-info',
    '.contact-form-wrap',
    '.map-placeholder',
    '.faq-item',
    '.newsletter-section .container',
    '.footer-content'
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const addRevealClasses = () => {
    document.querySelectorAll(revealSelectors.join(',')).forEach((element, index) => {
        if (element.closest('.hero')) {
            return;
        }

        element.classList.add('reveal');

        if (element.classList.contains('flex-section__img')) {
            element.classList.add('reveal--left');
        }

        if (element.classList.contains('flex-section__content')) {
            element.classList.add('reveal--right');
        }

        if (
            element.classList.contains('dish-card') ||
            element.classList.contains('testimonial-card') ||
            element.classList.contains('seasonal-card')
        ) {
            element.classList.add('reveal--zoom');
        }

        element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
    });
};

const revealOnScroll = () => {
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
};

const setActiveMenuTab = () => {
    const tabs = document.querySelectorAll('.menu-tabs .tab-link[href^="#"]');

    if (!tabs.length) {
        return;
    }

    const sections = [...tabs]
        .map((tab) => document.querySelector(tab.getAttribute('href')))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            tabs.forEach((tab) => {
                tab.classList.toggle('active', tab.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, {
        threshold: 0.35
    });

    sections.forEach((section) => observer.observe(section));
};

document.addEventListener('DOMContentLoaded', () => {
    addRevealClasses();
    revealOnScroll();
    setActiveMenuTab();
});
