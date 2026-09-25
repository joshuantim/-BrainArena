import pool from '../config/db.js';

// GET /api/categories
export async function getCategories(req, res) {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(q.id)::int AS question_count
      FROM categories c
      LEFT JOIN questions q ON q.category_id = c.id
      GROUP BY c.id
      ORDER BY c.id
    `);
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('GetCategories error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/questions?category=slug&difficulty=easy
// Returns questions WITHOUT correct_answer for quiz taking
export async function getQuestions(req, res) {
  try {
    const { category, difficulty } = req.query;

    if (!category || !difficulty) {
      return res.status(400).json({ error: 'Category and difficulty are required' });
    }

    const result = await pool.query(`
      SELECT q.id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.difficulty,
             c.slug AS category_slug, c.name AS category_name
      FROM questions q
      JOIN categories c ON c.id = q.category_id
      WHERE c.slug = $1 AND q.difficulty = $2
      ORDER BY RANDOM()
    `, [category, difficulty]);

    // Map to frontend-friendly format WITHOUT correct answers
    const questions = result.rows.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      difficulty: q.difficulty,
      category: q.category_name,
      categorySlug: q.category_slug,
    }));

    res.json({ questions });
  } catch (err) {
    console.error('GetQuestions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/questions/count?category=slug
export async function getQuestionCount(req, res) {
  try {
    const { category } = req.query;
    let query = `
      SELECT c.slug, c.name, q.difficulty, COUNT(*)::int AS count
      FROM questions q
      JOIN categories c ON c.id = q.category_id
    `;
    const params = [];
    if (category) {
      query += ' WHERE c.slug = $1';
      params.push(category);
    }
    query += ' GROUP BY c.slug, c.name, q.difficulty ORDER BY c.slug, q.difficulty';

    const result = await pool.query(query, params);
    res.json({ counts: result.rows });
  } catch (err) {
    console.error('GetQuestionCount error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
