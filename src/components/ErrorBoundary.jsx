import { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo)

        // In production, you could send this to an error tracking service
        // Example: logErrorToService(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c0c0c0',
                    fontFamily: 'Inter, sans-serif',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '20px',
                        color: '#c41e3a'
                    }}>
                        ⚠
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        letterSpacing: '2px',
                        marginBottom: '20px',
                        fontFamily: 'Playfair Display, serif'
                    }}>
                        SYSTEM ERROR
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        letterSpacing: '1px',
                        opacity: 0.7,
                        marginBottom: '30px',
                        maxWidth: '500px'
                    }}>
                        The archive encountered an unexpected error. Please refresh the page to continue.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            border: '1px solid #c41e3a',
                            color: '#c0c0c0',
                            fontSize: '12px',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(196, 30, 58, 0.1)'
                            e.target.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent'
                            e.target.style.boxShadow = 'none'
                        }}
                    >
                        RELOAD ARCHIVE
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{
                            marginTop: '40px',
                            maxWidth: '600px',
                            textAlign: 'left',
                            fontSize: '12px',
                            opacity: 0.5
                        }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{
                                background: '#0a0a0a',
                                padding: '15px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
}

export default ErrorBoundary
