import pool from '../config/db.js';

// GET /api/admin/questions
export async function listQuestions(req, res) {
  try {
    const { category, difficulty, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let query = `
      SELECT q.*, c.slug AS category_slug, c.name AS category_name
      FROM questions q
      JOIN categories c ON c.id = q.category_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.slug = $${paramIndex++}`;
      params.push(category);
    }
    if (difficulty) {
      query += ` AND q.difficulty = $${paramIndex++}`;
      params.push(difficulty);
    }

    query += ` ORDER BY c.slug, q.difficulty, q.id`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*)::int FROM questions q JOIN categories c ON c.id = q.category_id WHERE 1=1';
    const countParams = [];
    let cIdx = 1;
    if (category) { countQuery += ` AND c.slug = $${cIdx++}`; countParams.push(category); }
    if (difficulty) { countQuery += ` AND q.difficulty = $${cIdx++}`; countParams.push(difficulty); }
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      questions: result.rows,
      total: countResult.rows[0].count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('ListQuestions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/admin/questions
export async function createQuestion(req, res) {
  try {
    const { category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty } = req.body;

    if (!category || !question || !option_a || !option_b || !option_c || !option_d || !correct_answer || !difficulty) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['A', 'B', 'C', 'D'].includes(correct_answer.toUpperCase())) {
      return res.status(400).json({ error: 'correct_answer must be A, B, C, or D' });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'difficulty must be easy, medium, or hard' });
    }

    const catResult = await pool.query('SELECT id FROM categories WHERE slug = $1', [category]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const result = await pool.query(
      `INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [catResult.rows[0].id, question, option_a, option_b, option_c, option_d, correct_answer.toUpperCase(), difficulty]
    );

    res.status(201).json({ question: result.rows[0] });
  } catch (err) {
    console.error('CreateQuestion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// PUT /api/admin/questions/:id
export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const { question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category } = req.body;

    // Build dynamic update
    const fields = [];
    const params = [];
    let idx = 1;

    if (question) { fields.push(`question = $${idx++}`); params.push(question); }
    if (option_a) { fields.push(`option_a = $${idx++}`); params.push(option_a); }
    if (option_b) { fields.push(`option_b = $${idx++}`); params.push(option_b); }
    if (option_c) { fields.push(`option_c = $${idx++}`); params.push(option_c); }
    if (option_d) { fields.push(`option_d = $${idx++}`); params.push(option_d); }
    if (correct_answer) { fields.push(`correct_answer = $${idx++}`); params.push(correct_answer.toUpperCase()); }
    if (difficulty) { fields.push(`difficulty = $${idx++}`); params.push(difficulty); }

    if (category) {
      const catResult = await pool.query('SELECT id FROM categories WHERE slug = $1', [category]);
      if (catResult.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
      fields.push(`category_id = $${idx++}`);
      params.push(catResult.rows[0].id);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE questions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ question: result.rows[0] });
  } catch (err) {
    console.error('UpdateQuestion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /api/admin/questions/:id
export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted', id: parseInt(id) });
  } catch (err) {
    console.error('DeleteQuestion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
