export default function addOnViewListener(
    element: HTMLElement,
    handler: () => void | Promise<void>,
    options?: IntersectionObserverInit
): IntersectionObserver {
    if (!(element instanceof HTMLElement)) {
        throw new TypeError("Target Element is missing");
    }

    const intersectorObserverDefaultOptions: IntersectionObserverInit = {
        root: element.parentElement,
        threshold: 0.75,
        rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries, observer) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
            handler();
        }
    }, options ?? intersectorObserverDefaultOptions);

    return observer;
}
