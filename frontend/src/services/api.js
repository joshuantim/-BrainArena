/* ============================================================
   API Service — Centralized backend communication
   ============================================================ */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('brainarena_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==================== Auth ====================

export async function apiRegister(username, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  if (data.token) localStorage.setItem('brainarena_token', data.token);
  return data;
}

export async function apiLogin(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) localStorage.setItem('brainarena_token', data.token);
  return data;
}

export async function apiGetMe() {
  return request('/auth/me');
}

export function apiLogout() {
  localStorage.removeItem('brainarena_token');
}

export function isLoggedIn() {
  return !!getToken();
}

// ==================== Categories & Questions ====================

export async function apiGetCategories() {
  return request('/categories');
}

export async function apiGetQuestions(category, difficulty) {
  return request(`/questions?category=${category}&difficulty=${difficulty}`);
}

export async function apiGetQuestionCounts(category) {
  const params = category ? `?category=${category}` : '';
  return request(`/questions/count${params}`);
}

// ==================== Quiz Attempts ====================

export async function apiStartQuiz(category, difficulty) {
  return request('/quiz/start', {
    method: 'POST',
    body: JSON.stringify({ category, difficulty }),
  });
}

export async function apiSubmitAnswer(attemptId, questionId, answer) {
  return request(`/quiz/${attemptId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ questionId, answer }),
  });
}

export async function apiCompleteQuiz(attemptId) {
  return request(`/quiz/${attemptId}/complete`, {
    method: 'POST',
  });
}

export async function apiGetHistory() {
  return request('/quiz/history');
}

// ==================== Leaderboard ====================

export async function apiGetLeaderboard() {
  return request('/leaderboard');
}

// ==================== Admin ====================

export async function apiAdminGetQuestions(params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  return request(`/admin/questions?${searchParams}`);
}

export async function apiAdminCreateQuestion(questionData) {
  return request('/admin/questions', {
    method: 'POST',
    body: JSON.stringify(questionData),
  });
}

export async function apiAdminUpdateQuestion(id, questionData) {
  return request(`/admin/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(questionData),
  });
}

export async function apiAdminDeleteQuestion(id) {
  return request(`/admin/questions/${id}`, {
    method: 'DELETE',
  });
}
