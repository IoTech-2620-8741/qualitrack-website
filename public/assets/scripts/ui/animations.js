// IntersectionObserver callback: shows an element once it enters the viewport,
// then stops observing it so the animation only runs once.
function revealVisibleElements(entries, observer) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        }
    }
}

// Adds a fade-in effect on scroll to cards and sections.
// Skipped when the user prefers reduced motion or the browser lacks IntersectionObserver.
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