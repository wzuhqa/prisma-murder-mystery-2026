import { createContext, useContext } from 'react'

export const ForensicScannerContext = createContext(null)

export const useForensicScanner = () => {
    const context = useContext(ForensicScannerContext)
    if (!context) {
        throw new Error('useForensicScanner must be used within ForensicScannerProvider')
    }
    return context
}

