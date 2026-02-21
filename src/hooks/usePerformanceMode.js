import { useState, useEffect } from 'react';

/**
 * Hook to detect device performance capabilities
 * Reduces animations on low-end devices
 * @returns {Object} Performance mode settings
 */
const usePerformanceMode = () => {
    const [performanceMode, setPerformanceMode] = useState({
        isLowEnd: false,
        isMobile: false,
        prefersReducedMotion: false,
        shouldReduceAnimations: false
    });

    useEffect(() => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Estimate device performance
        const isLowEnd = (() => {
            // Check hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency || 2;

            // Check device memory (if available)
            const memory = navigator.deviceMemory || 4;

            // Check connection speed
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

            return cores < 4 || memory < 4 || slowConnection || isMobile;
        })();

        const shouldReduceAnimations = prefersReducedMotion || isLowEnd;

        setPerformanceMode({
            isLowEnd,
            isMobile,
            prefersReducedMotion,
            shouldReduceAnimations
        });

        // Listen for changes in reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => {
            setPerformanceMode(prev => ({
                ...prev,
                prefersReducedMotion: e.matches,
                shouldReduceAnimations: e.matches || prev.isLowEnd
            }));
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return performanceMode;
};

export default usePerformanceMode;
