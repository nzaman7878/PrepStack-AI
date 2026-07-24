import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Need this for cookies (refresh tokens) if implemented later
});

export const getTracks = async () => {
  const response = await api.get('/tracks');
  return response.data.data;
};

export const getTrack = async (slug) => {
  const response = await api.get(`/tracks/${slug}`);
  return response.data.data;
};

export const getTopic = async (slug) => {
  const response = await api.get(`/topics/${slug}`);
  return response.data.data;
};

export const getTopicContent = async (slug, difficulty = 'intermediate') => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/content/${slug}/overview?difficulty=${difficulty}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const getBookmarks = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/bookmarks', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const toggleBookmark = async (data) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/bookmarks', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const getPracticeQuiz = async (topicSlug, difficulty = 'intermediate') => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/practice/${topicSlug}/quiz?difficulty=${difficulty}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const getMockInterviewQuestion = async (trackSlug, difficulty = 'intermediate') => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/interview/${trackSlug}/question?difficulty=${difficulty}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const evaluateInterviewAnswer = async (data) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/interview/evaluate', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const getAdminCache = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/admin/cache', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const clearAdminCache = async (id = 'all') => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/admin/cache/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export default api;
