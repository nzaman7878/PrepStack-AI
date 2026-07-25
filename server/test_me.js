const axios = require('axios');

async function test() {
  try {
    let email = 'testuser@example.com';
    let password = 'password123';
    
    try {
      await axios.post('http://localhost:5000/api/v1/auth/register', {
        name: 'Test User',
        email,
        password
      });
    } catch (e) {
      // Ignore if already exists
    }

    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email,
      password
    });
    const token = loginRes.data.data.accessToken;
    console.log('Token:', token);

    const meRes = await axios.get('http://localhost:5000/api/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Me:', meRes.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
test();
