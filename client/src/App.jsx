import { useState, useEffect } from 'react'

// API Base URL - empty for same-origin requests (works with Vite proxy and production)
const API_BASE = ''

function App() {
    // Test States
    const [frontendStatus, setFrontendStatus] = useState({ status: 'success', message: 'React is running!' })
    const [backendStatus, setBackendStatus] = useState({ status: 'pending', message: 'Click to test' })
    const [databaseStatus, setDatabaseStatus] = useState({ status: 'pending', message: 'Click to test' })

    // Messages State
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)

    // Load messages on mount
    useEffect(() => {
        fetchMessages()
    }, [])

    // ================== API FUNCTIONS ==================

    const testBackend = async () => {
        setBackendStatus({ status: 'loading', message: 'Testing...' })
        try {
            const response = await fetch(`${API_BASE}/health`)
            const data = await response.json()
            if (data.status === 'SERVER ALIVE') {
                setBackendStatus({
                    status: 'success',
                    message: `Server Alive! DB: ${data.database}`
                })
            } else {
                throw new Error('Unexpected response')
            }
        } catch (error) {
            setBackendStatus({
                status: 'error',
                message: `Failed: ${error.message}`
            })
        }
    }

    const testDatabase = async () => {
        setDatabaseStatus({ status: 'loading', message: 'Testing...' })
        try {
            const response = await fetch(`${API_BASE}/api/db-test`)
            const data = await response.json()
            if (data.success) {
                setDatabaseStatus({
                    status: 'success',
                    message: 'MySQL Connected!'
                })
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            setDatabaseStatus({
                status: 'error',
                message: `Failed: ${error.message}`
            })
        }
    }

    const fetchMessages = async () => {
        setIsLoadingMessages(true)
        try {
            const response = await fetch(`${API_BASE}/api/messages`)
            const data = await response.json()
            if (data.success) {
                setMessages(data.data || [])
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        } finally {
            setIsLoadingMessages(false)
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setIsSending(true)
        try {
            const response = await fetch(`${API_BASE}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            })
            const data = await response.json()
            if (data.success) {
                setMessages(prev => [data.data, ...prev])
                setNewMessage('')
            } else {
                alert(data.message || 'Failed to send message')
            }
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setIsSending(false)
        }
    }

    const deleteMessage = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/api/messages/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                setMessages(prev => prev.filter(m => m.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    // ================== UI HELPERS ==================

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅'
            case 'error': return '❌'
            case 'loading': return '⏳'
            default: return '⚡'
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // ================== RENDER ==================

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <h1 className="header-title">🚀 Hostinger Testing Dashboard</h1>
                <p className="header-subtitle">Test your Frontend, Backend & Database connectivity</p>
                <span className="header-badge">React + Express + MySQL</span>
            </header>

            {/* Test Cards Grid */}
            <div className="test-grid">
                {/* Frontend Test */}
                <div className="test-card">
                    <div className="test-card-header">
                        <div className="test-icon frontend">⚛️</div>
                        <div>
                            <h3 className="test-card-title">Frontend Test</h3>
                            <p className="test-card-desc">React + Vite Status</p>
                        </div>
                    </div>
                    <div className={`status-box ${frontendStatus.status}`}>
                        <span className="status-icon">{getStatusIcon(frontendStatus.status)}</span>
                        <span className="status-text">{frontendStatus.message}</span>
                    </div>
                    <button className="test-btn" onClick={() => setFrontendStatus({ status: 'success', message: 'React is running perfectly! 🎉' })}>
                        🔄 Refresh Test
                    </button>
                </div>

                {/* Backend Test */}
                <div className="test-card">
                    <div className="test-card-header">
                        <div className="test-icon backend">🖥️</div>
                        <div>
                            <h3 className="test-card-title">Backend Test</h3>
                            <p className="test-card-desc">Express Server Status</p>
                        </div>
                    </div>
                    <div className={`status-box ${backendStatus.status}`}>
                        <span className="status-icon">{getStatusIcon(backendStatus.status)}</span>
                        <span className="status-text">{backendStatus.message}</span>
                    </div>
                    <button
                        className="test-btn"
                        onClick={testBackend}
                        disabled={backendStatus.status === 'loading'}
                    >
                        {backendStatus.status === 'loading' ? (
                            <><span className="spinner"></span> Testing...</>
                        ) : (
                            <>🔌 Test Connection</>
                        )}
                    </button>
                </div>

                {/* Database Test */}
                <div className="test-card">
                    <div className="test-card-header">
                        <div className="test-icon database">🗄️</div>
                        <div>
                            <h3 className="test-card-title">Database Test</h3>
                            <p className="test-card-desc">MySQL Connection</p>
                        </div>
                    </div>
                    <div className={`status-box ${databaseStatus.status}`}>
                        <span className="status-icon">{getStatusIcon(databaseStatus.status)}</span>
                        <span className="status-text">{databaseStatus.message}</span>
                    </div>
                    <button
                        className="test-btn"
                        onClick={testDatabase}
                        disabled={databaseStatus.status === 'loading'}
                    >
                        {databaseStatus.status === 'loading' ? (
                            <><span className="spinner"></span> Testing...</>
                        ) : (
                            <>🔗 Test MySQL</>
                        )}
                    </button>
                </div>
            </div>

            {/* Message Section */}
            <section className="message-section">
                <div className="section-header">
                    <div className="section-icon">📝</div>
                    <div>
                        <h2 className="section-title">Message System</h2>
                        <p className="section-subtitle">Send messages and save to MySQL database</p>
                    </div>
                </div>

                {/* Message Form */}
                <form className="message-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Type your message here... ✍️"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                    />
                    <button type="submit" className="send-btn" disabled={isSending || !newMessage.trim()}>
                        {isSending ? (
                            <><span className="spinner"></span> Sending...</>
                        ) : (
                            <>📤 Send</>
                        )}
                    </button>
                </form>

                {/* Saved Messages */}
                <div className="messages-container">
                    <div className="messages-header">
                        <span className="messages-title">💾 Saved Messages</span>
                        <span className="message-count">{messages.length} messages</span>
                    </div>

                    {isLoadingMessages ? (
                        <div className="empty-messages">
                            <span className="spinner"></span>
                            <p>Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-messages">
                            <div className="empty-icon">📭</div>
                            <p>No messages yet. Send your first message!</p>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className="message-item">
                                    <p className="message-content">{msg.content}</p>
                                    <div className="message-meta">
                                        <span className="message-time">
                                            🕐 {formatDate(msg.created_at)}
                                        </span>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteMessage(msg.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p className="footer-text">
                    Made with <span className="heart">❤️</span> for Hostinger Deployment
                </p>
            </footer>
        </div>
    )
}

export default App
