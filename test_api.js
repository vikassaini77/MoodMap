const https = require('https');

const options = {
  hostname: 'mood-map-five.vercel.app',
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${data.substring(0, 200)}`);
  });
});
req.write(JSON.stringify({ email: 'test', password: 'test' }));
req.end();
