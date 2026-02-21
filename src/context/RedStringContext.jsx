import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RedStringContext = createContext(null);

// Thematic route names
const ROUTE_NAMES = {
    '/': 'CRIME_SCENE',
    '/events': 'EVIDENCE_LOG',
    '/team': 'SUSPECTS',
    '/contact': 'TIPS_HOTLINE',
    '/register': 'WITNESS_STATEMENT',
    '/about': 'CASE_FILE'
};

const MAX_HISTORY = 5;

export const RedStringProvider = ({ children }) => {
    const location = useLocation();

    // State for the breadcrumb navigation system
    const [visitedPages, setVisitedPages] = useState(() => {
        // Try to restore from sessionStorage
        const saved = sessionStorage.getItem('redStringHistory');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    // State for the future Evidence Board interactions
    const [discoveredClues, setDiscoveredClues] = useState([]);
    const [connections, setConnections] = useState([]);
    const [activeString, setActiveString] = useState(null);

    // Track page visits
    useEffect(() => {
        const currentPath = location.pathname;

        setVisitedPages(prev => {
            // If we are navigating back to a page already in history, cut the string back to that point
            const existingIndex = prev.findIndex(node => node.path === currentPath);

            let newHistory;
            if (existingIndex !== -1) {
                newHistory = prev.slice(0, existingIndex + 1);
            } else {
                const newNode = {
                    id: Date.now() + Math.random(),
                    path: currentPath,
                    label: ROUTE_NAMES[currentPath] || currentPath.replace('/', '').toUpperCase() || 'UNKNOWN'
                };
                newHistory = [...prev, newNode];
            }

            // Keep only the last MAX_HISTORY items
            if (newHistory.length > MAX_HISTORY) {
                newHistory = newHistory.slice(newHistory.length - MAX_HISTORY);
            }

            // Save to sessionStorage
            sessionStorage.setItem('redStringHistory', JSON.stringify(newHistory));

            return newHistory;
        });
    }, [location.pathname]);

    const addClue = (clueId) => {
        if (!discoveredClues.includes(clueId)) {
            setDiscoveredClues(prev => [...prev, clueId]);
        }
    };

    const addConnection = (fromId, toId) => {
        setConnections(prev => [...prev, { id: `${fromId}-${toId}`, from: fromId, to: toId }]);
    };

    return (
        <RedStringContext.Provider
            value={{
                visitedPages,
                discoveredClues,
                addClue,
                connections,
                addConnection,
                activeString,
                setActiveString
            }}
        >
            {children}
        </RedStringContext.Provider>
    );
};

export const useRedString = () => {
    const context = useContext(RedStringContext);
    if (!context) {
        throw new Error('useRedString must be used within a RedStringProvider');
    }
    return context;
};
