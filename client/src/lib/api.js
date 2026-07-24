import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
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

export default api;
