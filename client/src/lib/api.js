import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Ignore if the request was to login/register or getMe initially
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logoutUser = async () => {
  const token = localStorage.getItem('token');
  const response = await api.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

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
