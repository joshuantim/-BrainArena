import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, ArrowRight, Brain } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { playSound } from '../utils/sound'

export default function Register({ showToast }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password || !confirmPassword) {
      showToast('Error', 'Please fill in all fields', 'warning')
      return
    }
    if (password !== confirmPassword) {
      showToast('Error', 'Passwords do not match', 'warning')
      return
    }
    if (password.length < 6) {
      showToast('Error', 'Password must be at least 6 characters', 'warning')
      return
    }
    setLoading(true)
    try {
      await register(username, email, password)
      playSound('complete')
      showToast('Welcome!', `Account created successfully! 🎉`, 'success')
      navigate('/')
    } catch (err) {
      playSound('wrong')
      showToast('Registration Failed', err.message || 'Could not create account', 'error')
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join BrainArena and start quizzing</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username"><User size={14} /> Username</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                maxLength={50}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                autoComplete="username"
              />
            </div>
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
                placeholder="Create a password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword"><Lock size={14} /> Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-glow btn-full" disabled={loading}>
              {loading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in <ArrowRight size={14} /></Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
