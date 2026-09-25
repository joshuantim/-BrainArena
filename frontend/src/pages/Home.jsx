import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Sparkles, Trophy, Search, ChevronRight,
  Lightbulb, FlaskConical, Cpu, Calculator, Globe, Clapperboard,
  Music, Landmark, Award, Zap, Target, BarChart3, LogIn
} from 'lucide-react'
import { apiGetCategories, apiGetLeaderboard } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { playSound } from '../utils/sound'

const iconComponents = {
  Lightbulb, FlaskConical, Cpu, Calculator, Trophy, Clapperboard, Music, Landmark, Globe,
}

export default function Home({ showToast }) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingLb, setLoadingLb] = useState(true)

  useEffect(() => {
    loadCategories()
    loadLeaderboard()
  }, [])

  async function loadCategories() {
    try {
      const data = await apiGetCategories()
      setCategories(data.categories || [])
    } catch (err) {
      showToast('Error', 'Failed to load categories', 'error')
    } finally {
      setLoadingCats(false)
    }
  }

  async function loadLeaderboard() {
    try {
      const data = await apiGetLeaderboard()
      setLeaderboard(data.leaderboard || [])
    } catch {
      // Silently fail — leaderboard may be empty
    } finally {
      setLoadingLb(false)
    }
  }

  const handleCategoryClick = (categorySlug) => {
    playSound('click')
    if (!isAuthenticated) {
      showToast('Login Required', 'Please login to take a quiz.', 'warning')
      navigate('/login')
      return
    }
    navigate(`/quiz/${categorySlug}`)
  }

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase()
    return cat.name.toLowerCase().includes(q) || (cat.description || '').toLowerCase().includes(q)
  })

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
              Challenge yourself with interactive quizzes across {categories.length || 9} categories.
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
                <div className="hero-stat-number"><Zap size={18} className="stat-icon" /> 90+</div>
                <div className="hero-stat-label">Questions</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number"><BarChart3 size={18} className="stat-icon" /> {categories.length || 9}</div>
                <div className="hero-stat-label">Categories</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number"><Target size={18} className="stat-icon" /> 3</div>
                <div className="hero-stat-label">Difficulty Levels</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="section" id="categories">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Choose a Category
          </motion.h2>
          <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Pick a topic that interests you and put your knowledge to the test.
          </motion.p>

          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search categories" />
          </div>

          {loadingCats ? (
            <div className="loading-state">Loading categories...</div>
          ) : (
            <div className="categories-grid">
              <AnimatePresence>
                {filteredCategories.map((cat, index) => {
                  const Icon = iconComponents[cat.icon] || Lightbulb
                  return (
                    <motion.div
                      key={cat.slug}
                      className="category-card"
                      style={{ '--card-color': cat.color }}
                      onClick={() => handleCategoryClick(cat.slug)}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Start ${cat.name} quiz`}
                    >
                      <div className="category-icon-wrapper" style={{ background: cat.color }}>
                        <Icon size={24} />
                      </div>
                      <h3 className="category-name">{cat.name}</h3>
                      <p className="category-desc">{cat.description}</p>
                      <div className="category-meta">
                        <span className="category-meta-item">{cat.question_count || 0} Questions</span>
                      </div>
                      <div className="category-arrow"><ChevronRight size={20} /></div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {!loadingCats && filteredCategories.length === 0 && (
            <div className="no-results"><Search size={48} /><p>No categories found.</p></div>
          )}
        </div>
      </section>

      {/* ============ LEADERBOARD SECTION ============ */}
      <section className="section" id="leaderboard">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Leaderboard
          </motion.h2>
          <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            See how you stack up against other quiz takers!
          </motion.p>

          <motion.div className="leaderboard-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="leaderboard-header">
              <h3><Trophy size={20} /> Top Scores</h3>
            </div>

            {loadingLb ? (
              <div className="loading-state" style={{ padding: '40px' }}>Loading leaderboard...</div>
            ) : leaderboard.length === 0 ? (
              <div className="leaderboard-empty">
                <Award size={48} />
                <p>No scores yet. Be the first to complete a quiz!</p>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-primary" style={{ marginTop: 16 }}>
                    <LogIn size={16} /> Sign Up to Play
                  </Link>
                )}
              </div>
            ) : (
              <div className="leaderboard-table-wrapper">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Total Score</th>
                      <th>Quizzes</th>
                      <th>Avg %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr key={entry.rank}>
                        <td>
                          <span className={`rank-badge rank-${entry.rank <= 3 ? entry.rank : 'default'}`}>
                            {entry.rank}
                          </span>
                        </td>
                        <td><strong>{entry.username}</strong></td>
                        <td className="score-cell">{entry.total_score}</td>
                        <td>{entry.total_quizzes}</td>
                        <td className="score-cell">{entry.avg_percentage}%</td>
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
    </main>
  )
}
