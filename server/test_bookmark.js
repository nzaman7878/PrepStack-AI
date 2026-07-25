const axios = require('axios');
async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
          email: 'admin@prepstack.ai',
          password: 'password123'
        });
        const token = loginRes.data.data.accessToken;
        
        console.log("Adding bookmark for fake topic...");
        const res = await axios.post('http://localhost:5000/api/v1/bookmarks', {
            itemType: 'topic',
            slug: 'some-fake-topic',
            title: 'Fake Topic Title',
            link: `/tracks/frontend/some-fake-topic`
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
test();
