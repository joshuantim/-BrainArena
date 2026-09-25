import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Moon, Sun, Volume2, VolumeX, Menu, X } from 'lucide-react'
import { playSound } from '../utils/sound'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ darkMode, setDarkMode, soundEnabled, setSoundEnabled }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="BrainArena Home">
          <div className="logo-icon">
            <Brain size={22} />
          </div>
          <span className="logo-text">
            Brain<span className="gradient-text">Arena</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {location.pathname === '/' && (
            <>
              <a href="#hero" className="nav-link">Home</a>
              <a href="#categories" className="nav-link">Categories</a>
              <a href="#leaderboard" className="nav-link">Leaderboard</a>
            </>
          )}
          {location.pathname !== '/' && (
            <Link to="/" className="nav-link">Home</Link>
          )}
        </div>

        <div className="nav-actions">
          <button
            className="nav-icon-btn"
            onClick={() => {
              setDarkMode(!darkMode)
              playSound('click')
            }}
            aria-label="Toggle dark mode"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="nav-icon-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled)
              if (!soundEnabled) playSound('click')
            }}
            aria-label="Toggle sound"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            className="nav-icon-btn mobile-menu-btn"
            onClick={() => {
              setMobileOpen(!mobileOpen)
              playSound('click')
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {location.pathname === '/' ? (
              <>
                <a href="#hero" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</a>
                <a href="#categories" className="mobile-link" onClick={() => setMobileOpen(false)}>Categories</a>
                <a href="#leaderboard" className="mobile-link" onClick={() => setMobileOpen(false)}>Leaderboard</a>
              </>
            ) : (
              <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
