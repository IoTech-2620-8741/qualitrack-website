function revealVisibleElements(entries, observer) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        }
    }
}

export function setupScrollReveal() {
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(revealVisibleElements, {threshold: 0.12});
    const elementsToReveal = document.querySelectorAll(
        '.offer-box, .benefit-card-image, .team-member, .plan-card, .accordion-item, .review-card'
    );

    for (const element of elementsToReveal) {
        element.classList.add('reveal-hidden');
        observer.observe(element);
    }
}