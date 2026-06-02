const https = require('https');

https.get('https://mood-ojvb50poy-vikassaini77s-projects.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]*\.js)"/);
    if (match) {
      const jsUrl = 'https://mood-ojvb50poy-vikassaini77s-projects.vercel.app' + match[1];
      console.log('Found JS URL:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          const apiMatch = jsData.match(/https:\/\/[a-zA-Z0-9-]+\.onrender\.com/);
          if (apiMatch) {
            console.log('FOUND API URL:', apiMatch[0]);
          } else {
            console.log('No onrender URL found in JS');
          }
        });
      });
    } else {
      console.log('No JS bundle found');
    }
  });
});
