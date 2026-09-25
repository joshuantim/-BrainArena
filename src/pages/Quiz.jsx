import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Star, ChevronLeft, ChevronRight, CheckCheck, ArrowLeft,
  Sprout, Flame, Skull, Play, ListChecks, AlertTriangle, X
} from 'lucide-react'
import { quizData, getQuestions, getDifficultyBreakdown } from '../data/questions'
import { playSound } from '../utils/sound'

const TIME_LIMITS = { easy: 15 * 60, medium: 10 * 60, hard: 5 * 60 }
const POINTS_PER_QUESTION = 10

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Quiz({ playerName, showToast }) {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const category = quizData.categories.find((c) => c.id === categoryId)

  // Screens: 'difficulty' | 'info' | 'active'
  const [screen, setScreen] = useState('difficulty')
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timeLimit, setTimeLimit] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!category) {
      showToast('Error', 'Invalid category. Redirecting...', 'error')
      setTimeout(() => navigate('/'), 1500)
    }
  }, [category, navigate, showToast])

  // Timer
  useEffect(() => {
    if (screen !== 'active' || isSubmitted) return

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          showToast("Time's Up!", 'Quiz automatically submitted.', 'warning')
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [screen, isSubmitted])

  const selectDifficulty = (diff) => {
    playSound('click')
    const qs = getQuestions(categoryId, diff)
    if (qs.length === 0) {
      showToast('No Questions', 'No questions available for this difficulty.', 'warning')
      return
    }
    setDifficulty(diff)
    setQuestions(qs)
    setAnswers(new Array(qs.length).fill(null))
    setTimeLimit(TIME_LIMITS[diff])
    setTimeRemaining(TIME_LIMITS[diff])
    setScreen('info')
  }

  const startQuiz = () => {
    playSound('click')
    setCurrentIndex(0)
    setScore(0)
    setIsSubmitted(false)
    setStartTime(Date.now())
    setScreen('active')
  }

  const handleAnswer = (answerIndex) => {
    if (isSubmitted) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answerIndex
    setAnswers(newAnswers)

    // Recalculate score
    let s = 0
    newAnswers.forEach((a, i) => {
      if (a !== null && a === questions[i].correct) s += POINTS_PER_QUESTION
    })
    setScore(s)

    if (answerIndex === questions[currentIndex].correct) {
      playSound('correct')
    } else {
      playSound('wrong')
    }
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
      playSound('click')
    }
  }

  const handleSubmit = useCallback((auto = false) => {
    if (isSubmitted) return
    setIsSubmitted(true)
    clearInterval(timerRef.current)

    const endTime = Date.now()
    const timeUsed = Math.round((endTime - (startTime || endTime)) / 1000)

    let correct = 0, wrong = 0, skipped = 0
    answers.forEach((a, i) => {
      if (a === null) skipped++
      else if (a === questions[i].correct) correct++
      else wrong++
    })

    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    const finalScore = correct * POINTS_PER_QUESTION

    const results = {
      category: category?.name || categoryId,
      categoryId,
      difficulty,
      totalQuestions: questions.length,
      correct, wrong, skipped,
      score: finalScore, percentage,
      timeUsed, timeLimit,
      autoSubmitted: auto,
      date: new Date().toISOString(),
      questions: questions.map((q, i) => ({
        question: q.question,
        answers: q.answers,
        correct: q.correct,
        userAnswer: answers[i],
      })),
    }

    localStorage.setItem('quizmaster_lastResult', JSON.stringify(results))
    saveToLeaderboard(results)

    playSound('complete')
    setTimeout(() => navigate('/result'), 300)
  }, [isSubmitted, answers, questions, startTime, category, categoryId, difficulty, timeLimit, navigate])

  const saveToLeaderboard = (results) => {
    const name = playerName || localStorage.getItem('quizmaster_playerName') || 'Player'
    let lb = []
    try { lb = JSON.parse(localStorage.getItem('quizmaster_leaderboard') || '[]') }
    catch { lb = [] }
    lb.push({
      name, category: results.category,
      score: results.score, total: results.totalQuestions,
      percentage: results.percentage, difficulty: results.difficulty,
      date: results.date,
    })
    lb.sort((a, b) => b.percentage - a.percentage)
    if (lb.length > 50) lb = lb.slice(0, 50)
    localStorage.setItem('quizmaster_leaderboard', JSON.stringify(lb))
  }

  if (!category) return null

  const breakdown = getDifficultyBreakdown(categoryId)
  const q = questions[currentIndex]
  const answeredCount = answers.filter((a) => a !== null).length
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

  // Keyboard nav
  useEffect(() => {
    if (screen !== 'active' || isSubmitted) return
    const handler = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) handleAnswer(parseInt(e.key) - 1)
      if (e.key === 'ArrowRight') goToQuestion(currentIndex + 1)
      if (e.key === 'ArrowLeft') goToQuestion(currentIndex - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, isSubmitted, currentIndex, answers])

  return (
    <main className="quiz-page">
      <div className="container">
        <AnimatePresence mode="wait">
          {/* ===== DIFFICULTY SCREEN ===== */}
          {screen === 'difficulty' && (
            <motion.div
              key="difficulty"
              className="screen-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="screen-title">{category.name}</h1>
              <p className="screen-subtitle">Choose your challenge level</p>

              <div className="difficulty-grid">
                {[
                  { key: 'easy', label: 'Easy', desc: 'Great for beginners.', icon: <Sprout size={28} />, count: breakdown.easy },
                  { key: 'medium', label: 'Medium', desc: 'A decent challenge.', icon: <Flame size={28} />, count: breakdown.medium },
                  { key: 'hard', label: 'Hard', desc: 'For true experts only!', icon: <Skull size={28} />, count: breakdown.hard },
                ].map((d) => (
                  <motion.button
                    key={d.key}
                    className={`difficulty-card difficulty-${d.key}`}
                    onClick={() => selectDifficulty(d.key)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="difficulty-icon">{d.icon}</div>
                    <div className="difficulty-label">{d.label}</div>
                    <div className="difficulty-desc">{d.desc}</div>
                    <div className="difficulty-count">
                      <ListChecks size={14} /> {d.count} Questions
                    </div>
                  </motion.button>
                ))}
              </div>

              <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> Back to Home
              </button>
            </motion.div>
          )}

          {/* ===== INFO SCREEN ===== */}
          {screen === 'info' && (
            <motion.div
              key="info"
              className="screen-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="info-card glass-card">
                <div className="info-icon-wrapper" style={{ background: category.color }}>
                  <Star size={28} />
                </div>
                <h2>{category.name} Quiz</h2>

                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Category</span><span className="info-value">{category.name}</span></div>
                  <div className="info-item"><span className="info-label">Difficulty</span><span className="info-value capitalize">{difficulty}</span></div>
                  <div className="info-item"><span className="info-label">Questions</span><span className="info-value">{questions.length}</span></div>
                  <div className="info-item"><span className="info-label">Time Limit</span><span className="info-value">{formatTime(TIME_LIMITS[difficulty])}</span></div>
                  <div className="info-item"><span className="info-label">Passing Score</span><span className="info-value">60%</span></div>
                  <div className="info-item"><span className="info-label">Points Per Q</span><span className="info-value">10 pts</span></div>
                </div>

                <p className="quiz-greeting">
                  Good luck, <strong>{playerName || 'Player'}</strong>! 🎯
                </p>

                <div className="info-actions">
                  <button className="btn btn-primary btn-lg btn-glow" onClick={startQuiz}>
                    <Play size={18} /> Start Quiz
                  </button>
                  <button className="btn btn-ghost" onClick={() => { playSound('click'); setScreen('difficulty') }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== ACTIVE QUIZ SCREEN ===== */}
          {screen === 'active' && q && (
            <motion.div
              key="active"
              className="screen-content quiz-active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Top bar */}
              <div className="quiz-top-bar">
                <div className="quiz-top-info">
                  <div className="quiz-top-item">
                    Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
                  </div>
                  <div className={`quiz-top-item timer ${timeRemaining <= 30 ? 'warning' : ''}`}>
                    <Clock size={16} /> {formatTime(timeRemaining)}
                  </div>
                  <div className="quiz-top-item score">
                    <Star size={16} /> {score}
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="question-card glass-card"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="question-badge" style={{ background: category.color }}>
                    {category.name}
                  </div>
                  <h2 className="question-text">{q.question}</h2>

                  <div className="answers-grid">
                    {q.answers.map((ans, i) => (
                      <motion.button
                        key={i}
                        className={`answer-option ${answers[currentIndex] === i ? 'selected' : ''}`}
                        onClick={() => handleAnswer(i)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="answer-letter">{'ABCD'[i]}</span>
                        <span className="answer-text">{ans}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="quiz-nav-buttons">
                <button
                  className="btn btn-glass"
                  disabled={currentIndex === 0}
                  onClick={() => goToQuestion(currentIndex - 1)}
                >
                  <ChevronLeft size={18} /> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => goToQuestion(currentIndex + 1)}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn btn-submit"
                    onClick={() => { playSound('click'); setShowSubmitModal(true) }}
                  >
                    <CheckCheck size={18} /> Submit Quiz
                  </button>
                )}
              </div>

              {/* Question navigator */}
              <div className="question-nav-grid glass-card">
                <div className="question-nav-title">Question Navigator</div>
                <div className="question-nav-numbers">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      className={`qnav-btn ${i === currentIndex ? 'current' : ''} ${answers[i] !== null ? 'answered' : ''}`}
                      onClick={() => goToQuestion(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="question-nav-legend">
                  <span><span className="dot dot-current" /> Current</span>
                  <span><span className="dot dot-answered" /> Answered</span>
                  <span><span className="dot dot-unanswered" /> Unanswered</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowSubmitModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              <div className="modal-icon modal-icon-success">
                <CheckCheck size={28} />
              </div>
              <h2>Submit Quiz?</h2>
              <p>Are you sure you want to submit your answers?</p>

              <div className="confirm-stats">
                <div className="confirm-stat">
                  <div className="confirm-stat-value">{answeredCount}</div>
                  <div className="confirm-stat-label">Answered</div>
                </div>
                <div className="confirm-stat">
                  <div className="confirm-stat-value">{questions.length - answeredCount}</div>
                  <div className="confirm-stat-label">Unanswered</div>
                </div>
                <div className="confirm-stat">
                  <div className="confirm-stat-value">{questions.length}</div>
                  <div className="confirm-stat-label">Total</div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => { setShowSubmitModal(false); handleSubmit(false) }}>
                  <CheckCheck size={16} /> Submit
                </button>
                <button className="btn btn-ghost" onClick={() => { playSound('click'); setShowSubmitModal(false) }}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
