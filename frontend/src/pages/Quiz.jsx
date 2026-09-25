import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Star, ChevronLeft, ChevronRight, CheckCheck, ArrowLeft,
  Sprout, Flame, Skull, Play, ListChecks, X
} from 'lucide-react'
import { apiGetCategories, apiGetQuestions, apiGetQuestionCounts, apiStartQuiz, apiSubmitAnswer, apiCompleteQuiz } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { playSound } from '../utils/sound'

const TIME_LIMITS = { easy: 15 * 60, medium: 10 * 60, hard: 5 * 60 }
const POINTS_PER_QUESTION = 10

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Quiz({ showToast }) {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [category, setCategory] = useState(null)
  const [screen, setScreen] = useState('difficulty')
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [attemptId, setAttemptId] = useState(null)
  const [breakdown, setBreakdown] = useState({ easy: 0, medium: 0, hard: 0 })
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Login Required', 'Please login to take a quiz.', 'warning')
      navigate('/login')
      return
    }
    loadCategoryInfo()
  }, [categoryId, isAuthenticated])

  async function loadCategoryInfo() {
    try {
      const catData = await apiGetCategories()
      const cat = (catData.categories || []).find(c => c.slug === categoryId)
      if (!cat) {
        showToast('Error', 'Category not found', 'error')
        navigate('/')
        return
      }
      setCategory(cat)

      const countData = await apiGetQuestionCounts(categoryId)
      const counts = countData.counts || []
      setBreakdown({
        easy: counts.find(c => c.difficulty === 'easy')?.count || 0,
        medium: counts.find(c => c.difficulty === 'medium')?.count || 0,
        hard: counts.find(c => c.difficulty === 'hard')?.count || 0,
      })
    } catch (err) {
      showToast('Error', 'Failed to load category', 'error')
      navigate('/')
    }
  }

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

  const selectDifficulty = async (diff) => {
    playSound('click')
    setDifficulty(diff)
    setLoadingQuestions(true)
    try {
      const data = await apiGetQuestions(categoryId, diff)
      const qs = data.questions || []
      if (qs.length === 0) {
        showToast('No Questions', 'No questions available.', 'warning')
        setLoadingQuestions(false)
        return
      }
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null))
      setTimeRemaining(TIME_LIMITS[diff])
      setScreen('info')
    } catch (err) {
      showToast('Error', 'Failed to load questions', 'error')
    } finally {
      setLoadingQuestions(false)
    }
  }

  const startQuiz = async () => {
    playSound('click')
    try {
      const data = await apiStartQuiz(categoryId, difficulty)
      setAttemptId(data.attemptId)
      setCurrentIndex(0)
      setScore(0)
      setIsSubmitted(false)
      setScreen('active')
    } catch (err) {
      showToast('Error', 'Failed to start quiz', 'error')
    }
  }

  const handleAnswer = async (answerIndex) => {
    if (isSubmitted) return
    const letterMap = ['A', 'B', 'C', 'D']
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answerIndex
    setAnswers(newAnswers)

    // Submit to server
    try {
      const result = await apiSubmitAnswer(attemptId, questions[currentIndex].id, letterMap[answerIndex])
      if (result.isCorrect) {
        playSound('correct')
      } else {
        playSound('wrong')
      }
    } catch {
      // If server fails, still let user continue
    }

    // Recalculate local score (optimistic)
    let s = 0
    newAnswers.forEach((a) => { if (a !== null) s += POINTS_PER_QUESTION })
    setScore(s)
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
      playSound('click')
    }
  }

  const handleSubmit = useCallback(async (auto = false) => {
    if (isSubmitted) return
    setIsSubmitted(true)
    clearInterval(timerRef.current)

    try {
      const data = await apiCompleteQuiz(attemptId)
      localStorage.setItem('quizmaster_lastResult', JSON.stringify(data.results))
      playSound('complete')
      setTimeout(() => navigate('/result'), 300)
    } catch (err) {
      showToast('Error', 'Failed to submit quiz', 'error')
      setIsSubmitted(false)
    }
  }, [isSubmitted, attemptId, navigate, showToast])

  if (!category) return <main className="quiz-page"><div className="container"><div className="loading-state">Loading...</div></div></main>

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
            <motion.div key="difficulty" className="screen-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="screen-title">{category.name}</h1>
              <p className="screen-subtitle">Choose your challenge level</p>
              {loadingQuestions && <div className="loading-state">Loading questions...</div>}
              <div className="difficulty-grid">
                {[
                  { key: 'easy', label: 'Easy', desc: 'Great for beginners.', icon: <Sprout size={28} />, count: breakdown.easy },
                  { key: 'medium', label: 'Medium', desc: 'A decent challenge.', icon: <Flame size={28} />, count: breakdown.medium },
                  { key: 'hard', label: 'Hard', desc: 'For true experts only!', icon: <Skull size={28} />, count: breakdown.hard },
                ].map((d) => (
                  <motion.button key={d.key} className={`difficulty-card difficulty-${d.key}`} onClick={() => selectDifficulty(d.key)} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loadingQuestions}>
                    <div className="difficulty-icon">{d.icon}</div>
                    <div className="difficulty-label">{d.label}</div>
                    <div className="difficulty-desc">{d.desc}</div>
                    <div className="difficulty-count"><ListChecks size={14} /> {d.count} Questions</div>
                  </motion.button>
                ))}
              </div>
              <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to Home</button>
            </motion.div>
          )}

          {/* ===== INFO SCREEN ===== */}
          {screen === 'info' && (
            <motion.div key="info" className="screen-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="info-card glass-card">
                <div className="info-icon-wrapper" style={{ background: category.color }}><Star size={28} /></div>
                <h2>{category.name} Quiz</h2>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Category</span><span className="info-value">{category.name}</span></div>
                  <div className="info-item"><span className="info-label">Difficulty</span><span className="info-value capitalize">{difficulty}</span></div>
                  <div className="info-item"><span className="info-label">Questions</span><span className="info-value">{questions.length}</span></div>
                  <div className="info-item"><span className="info-label">Time Limit</span><span className="info-value">{formatTime(TIME_LIMITS[difficulty])}</span></div>
                  <div className="info-item"><span className="info-label">Passing Score</span><span className="info-value">60%</span></div>
                  <div className="info-item"><span className="info-label">Points Per Q</span><span className="info-value">10 pts</span></div>
                </div>
                <div className="info-actions">
                  <button className="btn btn-primary btn-lg btn-glow" onClick={startQuiz}><Play size={18} /> Start Quiz</button>
                  <button className="btn btn-ghost" onClick={() => { playSound('click'); setScreen('difficulty') }}><ArrowLeft size={16} /> Back</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== ACTIVE QUIZ SCREEN ===== */}
          {screen === 'active' && q && (
            <motion.div key="active" className="screen-content quiz-active" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="quiz-top-bar">
                <div className="quiz-top-info">
                  <div className="quiz-top-item">Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong></div>
                  <div className={`quiz-top-item timer ${timeRemaining <= 30 ? 'warning' : ''}`}><Clock size={16} /> {formatTime(timeRemaining)}</div>
                  <div className="quiz-top-item score"><Star size={16} /> {answeredCount * POINTS_PER_QUESTION}</div>
                </div>
                <div className="progress-bar"><motion.div className="progress-fill" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3 }} /></div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} className="question-card glass-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                  <div className="question-badge" style={{ background: category.color }}>{category.name}</div>
                  <h2 className="question-text">{q.question}</h2>
                  <div className="answers-grid">
                    {q.options.map((ans, i) => (
                      <motion.button key={i} className={`answer-option ${answers[currentIndex] === i ? 'selected' : ''}`} onClick={() => handleAnswer(i)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <span className="answer-letter">{'ABCD'[i]}</span>
                        <span className="answer-text">{ans}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="quiz-nav-buttons">
                <button className="btn btn-glass" disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)}><ChevronLeft size={18} /> Previous</button>
                {currentIndex < questions.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => goToQuestion(currentIndex + 1)}>Next <ChevronRight size={18} /></button>
                ) : (
                  <button className="btn btn-submit" onClick={() => { playSound('click'); setShowSubmitModal(true) }}><CheckCheck size={18} /> Submit Quiz</button>
                )}
              </div>

              <div className="question-nav-grid glass-card">
                <div className="question-nav-title">Question Navigator</div>
                <div className="question-nav-numbers">
                  {questions.map((_, i) => (
                    <button key={i} className={`qnav-btn ${i === currentIndex ? 'current' : ''} ${answers[i] !== null ? 'answered' : ''}`} onClick={() => goToQuestion(i)}>{i + 1}</button>
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setShowSubmitModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
              <div className="modal-icon modal-icon-success"><CheckCheck size={28} /></div>
              <h2>Submit Quiz?</h2>
              <p>Are you sure you want to submit your answers?</p>
              <div className="confirm-stats">
                <div className="confirm-stat"><div className="confirm-stat-value">{answeredCount}</div><div className="confirm-stat-label">Answered</div></div>
                <div className="confirm-stat"><div className="confirm-stat-value">{questions.length - answeredCount}</div><div className="confirm-stat-label">Unanswered</div></div>
                <div className="confirm-stat"><div className="confirm-stat-value">{questions.length}</div><div className="confirm-stat-label">Total</div></div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => { setShowSubmitModal(false); handleSubmit(false) }}><CheckCheck size={16} /> Submit</button>
                <button className="btn btn-ghost" onClick={() => { playSound('click'); setShowSubmitModal(false) }}><X size={16} /> Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
