const https = require('https');

const data = JSON.stringify({
  email: `test${Date.now()}@gmail.com`,
  password: 'Password123!',
  fullName: 'Test User',
  age: 25,
  country: 'USA',
  goals: [],
  habitAnswers: {},
  emotionalAnswers: {}
});

const options = {
  hostname: 'moodmap-backend-ahzi.onrender.com',
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseBody = '';
  res.on('data', chunk => responseBody += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Response Body:', responseBody);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
