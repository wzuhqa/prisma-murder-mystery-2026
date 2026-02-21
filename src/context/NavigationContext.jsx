/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback } from 'react'

const NavigationContext = createContext(null)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

export const NavigationProvider = ({ children }) => {
  // Bypass slash effect - use simple navigation
  const triggerSlash = useCallback((navigateCallback) => {
    // Navigate directly without slash animation
    navigateCallback()
  }, [])

  const completeSlash = useCallback(() => {
    // No-op since we're bypassing the slash
  }, [])

  return (
    <NavigationContext.Provider value={{ isSlashActive: false, triggerSlash, completeSlash }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationContext

