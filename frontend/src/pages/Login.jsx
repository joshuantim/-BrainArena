import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, ArrowRight, Brain } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { playSound } from '../utils/sound'

export default function Login({ showToast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Error', 'Please fill in all fields', 'warning')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      playSound('correct')
      showToast('Welcome back!', 'Login successful 🎉', 'success')
      navigate('/')
    } catch (err) {
      playSound('wrong')
      showToast('Login Failed', err.message || 'Invalid email or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="container">
        <motion.div
          className="auth-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-icon">
            <Brain size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue your quiz journey</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email"><Mail size={14} /> Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password"><Lock size={14} /> Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-glow btn-full" disabled={loading}>
              {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one <ArrowRight size={14} /></Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
