import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Sparkles, Trophy, Search, Trash2, ChevronRight,
  Lightbulb, FlaskConical, Cpu, Calculator, Globe, Clapperboard,
  Music, Landmark, Award, User, ArrowRight, Zap, Target, BarChart3
} from 'lucide-react'
import { quizData, getCategoryQuestionCount, getDifficultyBreakdown } from '../data/questions'
import { playSound } from '../utils/sound'

const iconComponents = {
  Lightbulb, FlaskConical, Cpu, Calculator, Trophy, Clapperboard, Music, Landmark, Globe,
}

export default function Home({ playerName, setPlayerName, showToast }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNameModal, setShowNameModal] = useState(false)
  const [pendingCategory, setPendingCategory] = useState(null)
  const [nameInput, setNameInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (showNameModal && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 200)
    }
  }, [showNameModal])

  const handleCategoryClick = (categoryId) => {
    playSound('click')
    if (!playerName) {
      setPendingCategory(categoryId)
      setShowNameModal(true)
      return
    }
    navigate(`/quiz/${categoryId}`)
  }

  const submitName = () => {
    const name = nameInput.trim()
    if (!name) {
      showToast('Oops', 'Please enter your name to continue.', 'warning')
      return
    }
    setPlayerName(name)
    setShowNameModal(false)
    playSound('click')
    showToast('Welcome!', `Good to see you, ${name}! 🎉`, 'success')
    if (pendingCategory) {
      setTimeout(() => navigate(`/quiz/${pendingCategory}`), 400)
      setPendingCategory(null)
    }
  }

  const filteredCategories = quizData.categories.filter((cat) => {
    const q = searchQuery.toLowerCase()
    return cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)
  })

  const getLeaderboard = () => {
    try { return JSON.parse(localStorage.getItem('quizmaster_leaderboard') || '[]') }
    catch { return [] }
  }

  const [leaderboard, setLeaderboard] = useState(getLeaderboard)

  const clearLeaderboard = () => {
    if (confirm('Are you sure you want to clear the leaderboard?')) {
      localStorage.removeItem('quizmaster_leaderboard')
      setLeaderboard([])
      showToast('Cleared', 'Leaderboard has been reset.', 'info')
      playSound('click')
    }
  }

  const sortedLeaderboard = [...leaderboard]
    .sort((a, b) => b.percentage - a.percentage || new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  return (
    <main className="home-page">
      {/* ============ HERO SECTION ============ */}
      <section className="hero" id="hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>#1 Quiz Platform</span>
            </motion.div>

            <h1 className="hero-title">
              Test Your Knowledge
              <br />
              With <span className="hero-highlight">Fun Quizzes</span>
            </h1>

            <p className="hero-description">
              Challenge yourself with interactive quizzes across 9 categories.
              Track your scores, climb the leaderboard, and see how high you can rank!
            </p>

            <div className="hero-buttons">
              <button
                className="btn btn-primary btn-glow"
                onClick={() => {
                  playSound('click')
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Play size={18} /> Start Quiz
              </button>
              <a href="#categories" className="btn btn-glass">
                <Target size={18} /> View Categories
              </a>
              <a href="#leaderboard" className="btn btn-outline-glow">
                <Trophy size={18} /> Leaderboard
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">
                  <Zap size={18} className="stat-icon" /> 90+
                </div>
                <div className="hero-stat-label">Questions</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">
                  <BarChart3 size={18} className="stat-icon" /> 9
                </div>
                <div className="hero-stat-label">Categories</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">
                  <Target size={18} className="stat-icon" /> 3
                </div>
                <div className="hero-stat-label">Difficulty Levels</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="section" id="categories">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Choose a Category
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Pick a topic that interests you and put your knowledge to the test.
          </motion.p>

          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search categories"
            />
          </div>

          <div className="categories-grid">
            <AnimatePresence>
              {filteredCategories.map((cat, index) => {
                const Icon = iconComponents[cat.icon] || Lightbulb
                const count = getCategoryQuestionCount(cat.id)
                const breakdown = getDifficultyBreakdown(cat.id)
                return (
                  <motion.div
                    key={cat.id}
                    className="category-card"
                    style={{ '--card-color': cat.color }}
                    onClick={() => handleCategoryClick(cat.id)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Start ${cat.name} quiz`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCategoryClick(cat.id)
                      }
                    }}
                  >
                    <div className="category-icon-wrapper" style={{ background: cat.color }}>
                      <Icon size={24} />
                    </div>
                    <h3 className="category-name">{cat.name}</h3>
                    <p className="category-desc">{cat.description}</p>
                    <div className="category-meta">
                      <span className="category-meta-item">{count} Questions</span>
                      <span className="category-meta-item">
                        {breakdown.easy > 0 && breakdown.hard > 0 ? 'All Levels' : 'Mixed'}
                      </span>
                    </div>
                    <div className="category-arrow">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <Search size={48} />
              <p>No categories found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============ LEADERBOARD SECTION ============ */}
      <section className="section" id="leaderboard">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Leaderboard
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            See how you stack up against other quiz takers!
          </motion.p>

          <motion.div
            className="leaderboard-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="leaderboard-header">
              <h3><Trophy size={20} /> Top Scores</h3>
              {leaderboard.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={clearLeaderboard}>
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>

            {sortedLeaderboard.length === 0 ? (
              <div className="leaderboard-empty">
                <Award size={48} />
                <p>No scores yet. Be the first to complete a quiz!</p>
              </div>
            ) : (
              <div className="leaderboard-table-wrapper">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>%</th>
                      <th className="hide-mobile">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaderboard.map((entry, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`rank-badge rank-${i < 3 ? i + 1 : 'default'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td><strong>{entry.name}</strong></td>
                        <td>{entry.category || '—'}</td>
                        <td className="score-cell">{entry.score}/{entry.total * 10}</td>
                        <td className="score-cell">{entry.percentage}%</td>
                        <td className="hide-mobile">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© 2026 BrainArena. Built with ❤️ — All rights reserved.</p>
        </div>
      </footer>

      {/* ============ NAME MODAL ============ */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowNameModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="modal-icon">
                <User size={28} />
              </div>
              <h2>Welcome, Quiz Taker!</h2>
              <p>Enter your name to get started and track your scores.</p>
              <input
                ref={inputRef}
                type="text"
                className="modal-input"
                placeholder="Enter your name..."
                maxLength={30}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitName()}
              />
              <button className="btn btn-primary btn-lg" onClick={submitName}>
                <ArrowRight size={18} /> Let's Go!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
