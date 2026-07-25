const axios = require('axios');

async function testRoadmap() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@prepstack.ai',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;

    console.log('Token acquired. Testing Roadmap generation...');
    const genRes = await axios.post('http://localhost:5000/api/v1/admin/generate/roadmap', 
      { role: 'DevOps Engineer', difficulty: 'intermediate' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Generated Roadmap:', JSON.stringify(genRes.data.data, null, 2));
    
    const roadmapData = genRes.data.data;
    // publish it
    roadmapData.isPublished = true;
    
    console.log('Saving to DB...');
    const saveRes = await axios.post('http://localhost:5000/api/v1/roadmaps', roadmapData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Saved!', saveRes.data.data.slug);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
testRoadmap();
