import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your name')
        }
        await signUp(email, password, displayName)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">⛵</span>
          <h1>Voyage Photos</h1>
          <p>Share memories from the cruise!</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="displayName">Your Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                autoComplete="name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Come Aboard' : 'Set Sail'}
          </button>
        </form>

        <div className="toggle-auth">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError('') }}>
                Sign in
              </button>
            </>
          ) : (
            <>
              New crew member?{' '}
              <button onClick={() => { setIsSignUp(true); setError('') }}>
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
