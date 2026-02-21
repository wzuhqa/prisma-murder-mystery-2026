import { useState, useEffect, useRef } from 'react';
import styles from './TerminalDecrypt.module.css';

const obfuscatedChars = '!<>-_\\/[]{}—=+*^?#_';

const TerminalDecrypt = ({ text, speed = 30, delay = 0, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        let timeoutId;
        let intervalId;
        let frame = 0;

        // We only want to animate when it scrolls into view
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isDecrypting) {
                    setIsDecrypting(true);

                    timeoutId = setTimeout(() => {
                        intervalId = setInterval(() => {
                            if (frame >= text.length) {
                                clearInterval(intervalId);
                                setDisplayText(text);
                                return;
                            }

                            // Compute output string
                            const prefix = text.substring(0, frame);
                            const suffixLength = text.length - frame;

                            let randomSuffix = '';
                            for (let i = 0; i < suffixLength; i++) {
                                if (text[frame + i] === ' ') {
                                    randomSuffix += ' ';
                                } else {
                                    randomSuffix += obfuscatedChars[Math.floor(Math.random() * obfuscatedChars.length)];
                                }
                            }

                            setDisplayText(prefix + randomSuffix);

                            // Occasional pauses to simulate typing
                            if (Math.random() > 0.8) {
                                frame += 0;
                            } else {
                                frame += 1;
                            }

                        }, speed);
                    }, delay);

                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (targetRef.current) observer.observe(targetRef.current);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text, speed, delay, isDecrypting]);

    return (
        <span ref={targetRef} className={`${styles.decryptText} ${className}`}>
            {displayText || text.replace(/./g, '█')}
            {isDecrypting && displayText !== text && <span className={styles.cursor}>_</span>}
        </span>
    );
};

export default TerminalDecrypt;
