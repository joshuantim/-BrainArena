import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('quizmaster_darkMode') === 'true'
  })
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('quizmaster_sound') !== 'false'
  })
  const [toasts, setToasts] = useState([])
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('quizmaster_playerName') || ''
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('quizmaster_darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('quizmaster_sound', soundEnabled)
  }, [soundEnabled])

  useEffect(() => {
    if (playerName) localStorage.setItem('quizmaster_playerName', playerName)
  }, [playerName])

  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/quiz/:categoryId"
          element={
            <Quiz
              playerName={playerName}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/result"
          element={
            <Result
              showToast={showToast}
            />
          }
        />
      </Routes>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  )
}

export default App
