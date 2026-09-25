import { Router } from 'express';
import { getCategories, getQuestions, getQuestionCount } from '../controllers/quizController.js';
import { startQuiz, submitAnswer, completeQuiz, getHistory, getLeaderboard } from '../controllers/attemptController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/categories', getCategories);
router.get('/questions', getQuestions);
router.get('/questions/count', getQuestionCount);
router.get('/leaderboard', getLeaderboard);

// Authenticated endpoints
router.post('/quiz/start', authenticate, startQuiz);
router.post('/quiz/:attemptId/answer', authenticate, submitAnswer);
router.post('/quiz/:attemptId/complete', authenticate, completeQuiz);
router.get('/quiz/history', authenticate, getHistory);

export default router;
