import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, X, FastForward, Clock, Award, RotateCcw, Home,
  Share2, ChevronDown, Expand, Minimize2
} from 'lucide-react'
import { playSound } from '../utils/sound'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function getGrade(percentage) {
  if (percentage >= 90) return { label: 'Excellent', class: 'excellent', emoji: '🏆' }
  if (percentage >= 80) return { label: 'Very Good', class: 'very-good', emoji: '🌟' }
  if (percentage >= 70) return { label: 'Good', class: 'good', emoji: '👍' }
  if (percentage >= 60) return { label: 'Fair', class: 'fair', emoji: '📝' }
  return { label: 'Needs Improvement', class: 'needs-improvement', emoji: '💪' }
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export default function Result({ showToast }) {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const [expandedAll, setExpandedAll] = useState(false)
  const [openItems, setOpenItems] = useState(new Set())
  const canvasRef = useRef(null)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('quizmaster_lastResult'))
      if (!data) {
        showToast('No Results', 'No quiz results found. Redirecting...', 'warning')
        setTimeout(() => navigate('/'), 2000)
        return
      }
      setResults(data)

      // Animate percentage counter
      const target = data.percentage
      const duration = 1500
      const start = performance.now()
      const step = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        setAnimatedPercent(Math.round(target * ease))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)

      // Confetti for passing scores
      if (data.percentage >= 60) {
        setTimeout(() => {
          launchConfetti()
          playSound('complete')
        }, 800)
      }
    } catch {
      navigate('/')
    }
  }, [navigate, showToast])

  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#6C63FF', '#FF6B6B', '#2ED573', '#FFA502', '#1E90FF', '#E84393', '#00CEC9', '#FDCB6E']
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      opacity: 1,
      decay: Math.random() * 0.005 + 0.002,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = 0
      particles.forEach((p) => {
        if (p.opacity <= 0) return
        active++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.rotation += p.rotationSpeed
        p.opacity -= p.decay
      })
      if (active > 0) requestAnimationFrame(animate)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    animate()
  }, [])

  const toggleItem = (index) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
    playSound('click')
  }

  const toggleAll = () => {
    if (expandedAll) {
      setOpenItems(new Set())
    } else {
      setOpenItems(new Set(results.questions.map((_, i) => i)))
    }
    setExpandedAll(!expandedAll)
    playSound('click')
  }

  const handleShare = () => {
    if (!results) return
    const grade = getGrade(results.percentage)
    const text = `🧠 BrainArena Result!\n📚 ${results.category} (${capitalize(results.difficulty)})\n📊 Score: ${results.percentage}% — ${grade.label} ${grade.emoji}\n✅ ${results.correct}/${results.totalQuestions} correct\n⏱️ Time: ${formatTime(results.timeUsed)}\n\nThink you can beat me? Try BrainArena!`

    if (navigator.share) {
      navigator.share({ title: 'My BrainArena Result', text }).catch(() => copyText(text))
    } else {
      copyText(text)
    }
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied!', 'Result copied to clipboard!', 'success')
    }).catch(() => {
      showToast('Error', 'Could not copy to clipboard.', 'error')
    })
    playSound('click')
  }

  if (!results) return null

  const grade = getGrade(results.percentage)
  const circumference = 2 * Math.PI * 90
  const strokeOffset = circumference - (animatedPercent / 100) * circumference
  const playerName = localStorage.getItem('quizmaster_playerName') || 'Player'

  return (
    <main className="result-page">
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />

      <div className="container result-container">
        {/* ===== SCORE SECTION ===== */}
        <motion.section
          className="score-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="score-circle-wrapper">
            <svg className="score-circle-svg" viewBox="0 0 200 200">
              <circle className="score-circle-bg" cx="100" cy="100" r="90" />
              <circle
                className={`score-circle-fill ${grade.class}`}
                cx="100" cy="100" r="90"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeOffset,
                }}
              />
            </svg>
            <div className="score-text-overlay">
              <div className="score-percentage">
                <span className="score-num">{animatedPercent}</span>
                <span className="score-sign">%</span>
              </div>
              <div className="score-label">Score</div>
            </div>
          </div>

          <h1 className="result-title">Quiz Complete! {grade.emoji}</h1>
          <p className="result-player-name">Great job, {playerName}!</p>
          <div className={`grade-badge ${grade.class}`}>
            <Award size={18} />
            <span>{grade.label}</span>
          </div>
        </motion.section>

        {/* ===== STATS GRID ===== */}
        <motion.section
          className="stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: <Check size={22} />, value: results.correct, label: 'Correct', type: 'correct' },
            { icon: <X size={22} />, value: results.wrong, label: 'Wrong', type: 'wrong' },
            { icon: <FastForward size={22} />, value: results.skipped, label: 'Skipped', type: 'skipped' },
            { icon: <Clock size={22} />, value: formatTime(results.timeUsed), label: 'Time Used', type: 'time' },
          ].map((stat, i) => (
            <motion.div
              key={stat.type}
              className={`stat-card stat-${stat.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ===== ANSWER REVIEW ===== */}
        <motion.section
          className="review-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="review-header">
            <h2 className="review-title">Review Answers</h2>
            <button className="btn btn-ghost btn-sm" onClick={toggleAll}>
              {expandedAll ? <Minimize2 size={14} /> : <Expand size={14} />}
              {expandedAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="review-list">
            {results.questions.map((q, i) => {
              let status, StatusIcon
              if (q.userAnswer === null || q.userAnswer === undefined) {
                status = 'skipped'; StatusIcon = FastForward
              } else if (q.userAnswer === q.correct) {
                status = 'correct'; StatusIcon = Check
              } else {
                status = 'wrong'; StatusIcon = X
              }

              const isOpen = openItems.has(i)

              return (
                <div key={i} className={`review-item ${status} ${isOpen ? 'open' : ''}`}>
                  <button className="review-item-header" onClick={() => toggleItem(i)}>
                    <div className={`review-status-icon status-${status}`}>
                      <StatusIcon size={14} />
                    </div>
                    <span className="review-item-question">{q.question}</span>
                    <span className="review-item-number">Q{i + 1}</span>
                    <ChevronDown size={16} className={`review-chevron ${isOpen ? 'rotated' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="review-item-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="review-answers">
                          {q.answers.map((ans, ai) => {
                            let rowClass = ''
                            if (ai === q.correct) rowClass = 'is-correct'
                            else if (ai === q.userAnswer && ai !== q.correct) rowClass = 'is-wrong'
                            return (
                              <div key={ai} className={`review-answer-row ${rowClass}`}>
                                <span className="review-answer-letter">{'ABCD'[ai]}</span>
                                <span>{ans}</span>
                                {ai === q.correct && <Check size={14} className="review-indicator correct-indicator" />}
                                {ai === q.userAnswer && ai !== q.correct && <X size={14} className="review-indicator wrong-indicator" />}
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ===== ACTION BUTTONS ===== */}
        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button className="btn btn-primary btn-lg btn-glow" onClick={() => {
            playSound('click')
            navigate(`/quiz/${results.categoryId}`)
          }}>
            <RotateCcw size={18} /> Try Again
          </button>
          <button className="btn btn-glass btn-lg" onClick={() => navigate('/')}>
            <Home size={18} /> Go Home
          </button>
          <button className="btn btn-outline-glow btn-lg" onClick={handleShare}>
            <Share2 size={18} /> Share Result
          </button>
        </motion.div>
      </div>
    </main>
  )
}
