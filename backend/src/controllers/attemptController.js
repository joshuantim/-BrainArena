import pool from '../config/db.js';

const TIME_LIMITS = { easy: 900, medium: 600, hard: 300 }; // seconds
const POINTS_PER_QUESTION = 10;

// POST /api/quiz/start
export async function startQuiz(req, res) {
  try {
    const { category, difficulty } = req.body;
    const userId = req.user.id;

    if (!category || !difficulty) {
      return res.status(400).json({ error: 'Category and difficulty are required' });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    // Get category
    const catResult = await pool.query('SELECT id FROM categories WHERE slug = $1', [category]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const categoryId = catResult.rows[0].id;

    // Count available questions
    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM questions WHERE category_id = $1 AND difficulty = $2',
      [categoryId, difficulty]
    );
    const totalQuestions = countResult.rows[0].count;

    if (totalQuestions === 0) {
      return res.status(404).json({ error: 'No questions available for this selection' });
    }

    // Create attempt
    const attempt = await pool.query(
      `INSERT INTO quiz_attempts (user_id, category_id, difficulty, total_questions, time_limit)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, started_at`,
      [userId, categoryId, difficulty, totalQuestions, TIME_LIMITS[difficulty]]
    );

    res.status(201).json({
      attemptId: attempt.rows[0].id,
      totalQuestions,
      timeLimit: TIME_LIMITS[difficulty],
      startedAt: attempt.rows[0].started_at,
    });
  } catch (err) {
    console.error('StartQuiz error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/quiz/:attemptId/answer
export async function submitAnswer(req, res) {
  try {
    const { attemptId } = req.params;
    const { questionId, answer } = req.body;
    const userId = req.user.id;

    if (!questionId || !answer) {
      return res.status(400).json({ error: 'questionId and answer are required' });
    }

    if (!['A', 'B', 'C', 'D'].includes(answer.toUpperCase())) {
      return res.status(400).json({ error: 'Answer must be A, B, C, or D' });
    }

    // Verify attempt belongs to user and is in progress
    const attemptResult = await pool.query(
      'SELECT id, status FROM quiz_attempts WHERE id = $1 AND user_id = $2',
      [attemptId, userId]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }

    if (attemptResult.rows[0].status !== 'in_progress') {
      return res.status(400).json({ error: 'This quiz has already been completed' });
    }

    // Get correct answer from DB
    const questionResult = await pool.query(
      'SELECT correct_answer FROM questions WHERE id = $1',
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correctAnswer = questionResult.rows[0].correct_answer;
    const isCorrect = answer.toUpperCase() === correctAnswer;

    // Upsert answer (allows changing answer)
    await pool.query(
      `INSERT INTO quiz_answers (attempt_id, question_id, selected_answer, is_correct)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (attempt_id, question_id) DO UPDATE SET
         selected_answer = $3, is_correct = $4, answered_at = NOW()`,
      [attemptId, questionId, answer.toUpperCase(), isCorrect]
    );

    res.json({ isCorrect, correctAnswer });
  } catch (err) {
    console.error('SubmitAnswer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/quiz/:attemptId/complete
export async function completeQuiz(req, res) {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    // Verify attempt
    const attemptResult = await pool.query(
      `SELECT qa.*, c.slug AS category_slug, c.name AS category_name
       FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.id = $1 AND qa.user_id = $2`,
      [attemptId, userId]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }

    const attempt = attemptResult.rows[0];

    if (attempt.status === 'completed') {
      return res.status(400).json({ error: 'Quiz already completed' });
    }

    // Calculate results
    const answersResult = await pool.query(
      `SELECT qa.*, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer
       FROM quiz_answers qa
       JOIN questions q ON q.id = qa.question_id
       WHERE qa.attempt_id = $1
       ORDER BY qa.answered_at`,
      [attemptId]
    );

    const answers = answersResult.rows;
    const correctCount = answers.filter(a => a.is_correct).length;
    const wrongCount = answers.filter(a => !a.is_correct).length;
    const skippedCount = attempt.total_questions - answers.length;
    const score = correctCount * POINTS_PER_QUESTION;
    const percentage = attempt.total_questions > 0
      ? Math.round((correctCount / attempt.total_questions) * 100) : 0;

    const timeUsed = Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000);

    // Update attempt
    await pool.query(
      `UPDATE quiz_attempts SET
         correct_answers = $1, score = $2, time_used = $3,
         status = 'completed', completed_at = NOW()
       WHERE id = $4`,
      [correctCount, score, Math.min(timeUsed, attempt.time_limit), attemptId]
    );

    // Build question review (now including correct answers since quiz is over)
    const questionReview = answers.map(a => ({
      question: a.question,
      answers: [a.option_a, a.option_b, a.option_c, a.option_d],
      correct: ['A', 'B', 'C', 'D'].indexOf(a.correct_answer),
      userAnswer: a.selected_answer ? ['A', 'B', 'C', 'D'].indexOf(a.selected_answer) : null,
    }));

    // Also include unanswered questions
    const allQuestionsResult = await pool.query(
      `SELECT q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer
       FROM questions q
       WHERE q.category_id = $1 AND q.difficulty = $2
       AND q.id NOT IN (SELECT question_id FROM quiz_answers WHERE attempt_id = $3)`,
      [attempt.category_id, attempt.difficulty, attemptId]
    );

    const skippedQuestions = allQuestionsResult.rows.map(q => ({
      question: q.question,
      answers: [q.option_a, q.option_b, q.option_c, q.option_d],
      correct: ['A', 'B', 'C', 'D'].indexOf(q.correct_answer),
      userAnswer: null,
    }));

    res.json({
      results: {
        category: attempt.category_name,
        categoryId: attempt.category_slug,
        difficulty: attempt.difficulty,
        totalQuestions: attempt.total_questions,
        correct: correctCount,
        wrong: wrongCount,
        skipped: skippedCount,
        score,
        percentage,
        timeUsed: Math.min(timeUsed, attempt.time_limit),
        timeLimit: attempt.time_limit,
        date: new Date().toISOString(),
        questions: [...questionReview, ...skippedQuestions],
      },
    });
  } catch (err) {
    console.error('CompleteQuiz error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/quiz/history
export async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT qa.id, qa.score, qa.total_questions, qa.correct_answers, qa.difficulty,
              qa.time_used, qa.status, qa.started_at, qa.completed_at,
              c.name AS category, c.slug AS category_slug
       FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.user_id = $1 AND qa.status = 'completed'
       ORDER BY qa.completed_at DESC
       LIMIT 50`,
      [userId]
    );

    const history = result.rows.map(r => ({
      ...r,
      percentage: r.total_questions > 0 ? Math.round((r.correct_answers / r.total_questions) * 100) : 0,
    }));

    res.json({ history });
  } catch (err) {
    console.error('GetHistory error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/leaderboard
export async function getLeaderboard(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        u.username,
        COUNT(qa.id)::int AS total_quizzes,
        MAX(qa.score) AS best_score,
        ROUND(AVG(
          CASE WHEN qa.total_questions > 0
            THEN (qa.correct_answers::decimal / qa.total_questions) * 100
            ELSE 0 END
        ))::int AS avg_percentage,
        SUM(qa.score)::int AS total_score
      FROM users u
      JOIN quiz_attempts qa ON qa.user_id = u.id
      WHERE qa.status = 'completed'
      GROUP BY u.id, u.username
      ORDER BY total_score DESC, avg_percentage DESC
      LIMIT 20
    `);

    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error('GetLeaderboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
