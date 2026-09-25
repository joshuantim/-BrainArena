import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Shield, Save, X } from 'lucide-react'
import { apiAdminGetQuestions, apiAdminCreateQuestion, apiAdminUpdateQuestion, apiAdminDeleteQuestion, apiGetCategories } from '../services/api'
import { playSound } from '../utils/sound'

export default function Admin({ showToast }) {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    category: '', question: '', option_a: '', option_b: '',
    option_c: '', option_d: '', correct_answer: 'A', difficulty: 'easy',
  })

  useEffect(() => { loadData() }, [filterCat, filterDiff])

  async function loadData() {
    setLoading(true)
    try {
      const [qData, cData] = await Promise.all([
        apiAdminGetQuestions({ category: filterCat, difficulty: filterDiff }),
        apiGetCategories(),
      ])
      setQuestions(qData.questions || [])
      setCategories(cData.categories || [])
    } catch (err) {
      showToast('Error', 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingId(null)
    setForm({
      category: categories[0]?.slug || '', question: '', option_a: '', option_b: '',
      option_c: '', option_d: '', correct_answer: 'A', difficulty: 'easy',
    })
    setShowForm(true)
    playSound('click')
  }

  function openEditForm(q) {
    setEditingId(q.id)
    setForm({
      category: q.category_slug, question: q.question,
      option_a: q.option_a, option_b: q.option_b,
      option_c: q.option_c, option_d: q.option_d,
      correct_answer: q.correct_answer, difficulty: q.difficulty,
    })
    setShowForm(true)
    playSound('click')
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      if (editingId) {
        await apiAdminUpdateQuestion(editingId, form)
        showToast('Updated', 'Question updated successfully', 'success')
      } else {
        await apiAdminCreateQuestion(form)
        showToast('Created', 'Question created successfully', 'success')
      }
      playSound('correct')
      setShowForm(false)
      loadData()
    } catch (err) {
      showToast('Error', err.message || 'Failed to save question', 'error')
      playSound('wrong')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this question?')) return
    try {
      await apiAdminDeleteQuestion(id)
      showToast('Deleted', 'Question deleted', 'info')
      playSound('click')
      loadData()
    } catch (err) {
      showToast('Error', 'Failed to delete question', 'error')
    }
  }

  return (
    <main className="admin-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header">
            <h1 className="screen-title"><Shield size={28} /> Admin Panel</h1>
            <button className="btn btn-primary" onClick={openCreateForm}>
              <Plus size={16} /> Add Question
            </button>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <select
              className="form-select"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Questions list */}
          {loading ? (
            <div className="loading-state">Loading questions...</div>
          ) : (
            <div className="admin-questions-list">
              {questions.length === 0 ? (
                <div className="leaderboard-empty"><p>No questions found.</p></div>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="admin-question-card glass-card">
                    <div className="admin-question-header">
                      <span className="admin-question-text">{q.question}</span>
                      <div className="admin-question-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditForm(q)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm admin-delete-btn" onClick={() => handleDelete(q.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="admin-question-meta">
                      <span className="admin-tag">{q.category_name || q.category_slug}</span>
                      <span className={`admin-tag tag-${q.difficulty}`}>{q.difficulty}</span>
                      <span className="admin-tag">Answer: {q.correct_answer}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div
            className="modal admin-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>{editingId ? 'Edit Question' : 'Add New Question'}</h2>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Question</label>
                <textarea className="form-input form-textarea" value={form.question} onChange={e => setForm({...form, question: e.target.value})} rows={3} required />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Option A</label><input className="form-input" value={form.option_a} onChange={e => setForm({...form, option_a: e.target.value})} required /></div>
                <div className="form-group"><label>Option B</label><input className="form-input" value={form.option_b} onChange={e => setForm({...form, option_b: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Option C</label><input className="form-input" value={form.option_c} onChange={e => setForm({...form, option_c: e.target.value})} required /></div>
                <div className="form-group"><label>Option D</label><input className="form-input" value={form.option_d} onChange={e => setForm({...form, option_d: e.target.value})} required /></div>
              </div>
              <div className="form-group">
                <label>Correct Answer</label>
                <select className="form-select" value={form.correct_answer} onChange={e => setForm({...form, correct_answer: e.target.value})}>
                  <option value="A">A</option><option value="B">B</option>
                  <option value="C">C</option><option value="D">D</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary"><Save size={16} /> Save</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}><X size={16} /> Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  )
}
