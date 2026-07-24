const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

async function runTests() {
  try {
    console.log('--- TESTING AUTH ENDPOINTS ---');
    // Login
    const loginRes = await api.post('/auth/login', { email: 'admin@prepstack.ai', password: 'password123' });
    const token = loginRes.data.data.accessToken;
    console.log('Login: SUCCESS');
    
    // Get Me
    const meRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Get Me: SUCCESS', meRes.data.data.user.email);
    
    console.log('\n--- TESTING TRACKS ENDPOINTS ---');
    const tracksRes = await api.get('/tracks');
    const tracks = tracksRes.data.data;
    console.log(`Get Tracks: SUCCESS (${tracks.length} tracks found)`);
    
    if (tracks.length > 0) {
      const slug = tracks[0].slug;
      const trackRes = await api.get(`/tracks/${slug}`);
      console.log(`Get Track By Slug (${slug}): SUCCESS`);
      
      const topics = trackRes.data.data.topics;
      
      if (topics && topics.length > 0) {
        const topicSlug = topics[0].slug;
        console.log(`\n--- TESTING CONTENT ENDPOINTS FOR ${topicSlug} ---`);
        try {
          console.log(`Fetching topic content for ${topicSlug}... (This will call Gemini if not cached)`);
          const contentRes = await api.get(`/content/${topicSlug}/overview?difficulty=beginner`, { headers: { Authorization: `Bearer ${token}` } });
          console.log(`Get Topic Content: SUCCESS`);
        } catch (e) {
          console.error(`Get Topic Content: FAILED`, e.response?.data || e.message);
        }
        
        console.log(`\n--- TESTING PRACTICE ENDPOINTS ---`);
        try {
          console.log(`Fetching practice quiz for ${topicSlug}...`);
          const practiceRes = await api.get(`/practice/${topicSlug}/quiz?difficulty=beginner`, { headers: { Authorization: `Bearer ${token}` } });
          console.log(`Get Practice Quiz: SUCCESS`);
        } catch (e) {
          console.error(`Get Practice Quiz: FAILED`, e.response?.data || e.message);
        }
      }
      
      console.log(`\n--- TESTING INTERVIEW ENDPOINTS ---`);
      try {
        console.log(`Fetching mock interview for track ${slug}...`);
        const interviewRes = await api.get(`/interview/${slug}/question?difficulty=intermediate`, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`Get Mock Interview Question: SUCCESS`);
        
        const questionData = interviewRes.data.data.questionData;
        
        console.log(`Evaluating answer...`);
        const evalRes = await api.post(`/interview/evaluate`, {
          question: questionData.question,
          candidateAnswer: 'I do not know the answer.',
          idealAnswer: questionData.idealAnswer,
          criteria: questionData.evaluationCriteria
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`Evaluate Answer: SUCCESS`, evalRes.data.data.evaluation.score);
        
      } catch (e) {
        console.error(`Interview endpoints: FAILED`, e.response?.data || e.message);
      }
    }
    
    console.log('\n--- TESTING BOOKMARKS ENDPOINTS ---');
    try {
      const toggleRes = await api.post('/bookmarks', { slug: tracks[0].topics[0]?.slug || 'react-fundamentals', itemType: 'topic' }, { headers: { Authorization: `Bearer ${token}` } });
      console.log(`Toggle Bookmark: SUCCESS`);
      
      const getBRes = await api.get('/bookmarks', { headers: { Authorization: `Bearer ${token}` } });
      console.log(`Get Bookmarks: SUCCESS (${getBRes.data.data.length} bookmarks)`);
    } catch (e) {
      console.error(`Bookmarks endpoints: FAILED`, e.response?.data || e.message);
    }
    
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

runTests();
