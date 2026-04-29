import http from 'http';

const testAPI = () => {
  return new Promise((resolve) => {
    http.get('http://localhost:5000/api/internships', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if(res.statusCode === 200) {
          console.log('✅ Backend API is responding correctly. Status 200.');
          resolve(true);
        } else {
          console.log('❌ Backend API returned status:', res.statusCode);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log('❌ Backend API Error:', err.message);
      resolve(false);
    });
  });
};

testAPI();
