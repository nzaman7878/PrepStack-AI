import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const updateUser = async (data) => {
  const response = await api.put('/auth/me', data);
  return response.data.data;
};

export const getStats = async () => {
  const response = await api.get('/auth/stats');
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

// Admin Track API
export const createTrack = async (data) => {
  const response = await api.post('/tracks', data);
  return response.data.data;
};

export const updateTrack = async (id, data) => {
  const response = await api.put(`/tracks/${id}`, data);
  return response.data.data;
};

export const deleteTrack = async (id) => {
  const response = await api.delete(`/tracks/${id}`);
  return response.data.data;
};

export const getTopic = async (slug) => {
  const response = await api.get(`/topics/${slug}`);
  return response.data.data;
};

// Admin Topic API
export const getAllTopics = async () => {
  const response = await api.get('/topics?all=true');
  return response.data.data;
};

export const createTopic = async (data) => {
  const response = await api.post('/topics', data);
  return response.data.data;
};

export const updateTopic = async (id, data) => {
  const response = await api.put(`/topics/${id}`, data);
  return response.data.data;
};

export const deleteTopic = async (id) => {
  const response = await api.delete(`/topics/${id}`);
  return response.data.data;
};

export const getTopicContent = async (slug, difficulty = 'intermediate') => {
  const response = await api.get(`/content/${slug}/overview?difficulty=${difficulty}`);
  return response.data.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data.data;
};

export const toggleBookmark = async (data) => {
  const response = await api.post('/bookmarks', data);
  return response.data.data;
};

export const getPracticeQuiz = async (topicSlug, difficulty = 'intermediate') => {
  const response = await api.get(`/practice/${topicSlug}/quiz?difficulty=${difficulty}`);
  return response.data.data;
};

export const getMockInterviewQuestion = async (trackSlug, difficulty = 'intermediate') => {
  const response = await api.get(`/interview/${trackSlug}/question?difficulty=${difficulty}`);
  return response.data.data;
};

export const evaluateInterviewAnswer = async (data) => {
  const response = await api.post('/interview/evaluate', data);
  return response.data.data;
};

export const getAdminCache = async () => {
  const response = await api.get('/admin/cache');
  return response.data.data;
};

export const clearAdminCache = async (id = 'all') => {
  const response = await api.delete(`/admin/cache/${id}`);
  return response.data.data;
};

export const getContentById = async (id) => {
  const response = await api.get(`/admin/content/${id}`);
  return response.data.data;
};

export const createContent = async (data) => {
  const response = await api.post('/admin/content', data);
  return response.data.data;
};

export const updateContent = async (id, data) => {
  const response = await api.put(`/admin/content/${id}`, data);
  return response.data.data;
};

export const generateAdminTopicContent = async (topicSlug, difficulty = 'intermediate') => {
  const response = await api.post(`/admin/generate/topic/${topicSlug}/overview`, { difficulty });
  return response.data.data;
};

export const generateAdminPracticeQuiz = async (topicSlug, difficulty = 'intermediate') => {
  const response = await api.post(`/admin/generate/topic/${topicSlug}/practice`, { difficulty });
  return response.data.data;
};

export const generateAdminInterviewQuestion = async (trackSlug, difficulty = 'intermediate') => {
  const response = await api.post(`/admin/generate/track/${trackSlug}/interview`, { difficulty });
  return response.data.data;
};

export default api;
