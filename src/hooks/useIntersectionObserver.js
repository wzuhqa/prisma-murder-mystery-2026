import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer
 * Triggers animations only when element is in viewport
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isIntersecting, hasIntersected]
 */
const useIntersectionObserver = (options = {}) => {
    const ref = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px',
            triggerOnce: true,
            ...options
        };

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);

            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);

                // If triggerOnce is true, disconnect after first intersection
                if (defaultOptions.triggerOnce) {
                    observer.disconnect();
                }
            }
        }, defaultOptions);

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options.threshold, options.rootMargin, options.triggerOnce, hasIntersected]);

    return [ref, isIntersecting, hasIntersected];
};

export default useIntersectionObserver;
