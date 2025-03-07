import https from 'https';

export default function doLoginRequest(username, password) {
  return new Promise((resolve, reject) => {
    const requestBody = `${encodeURI('username')}=${encodeURI(username)}&${encodeURI('password')}=${encodeURI(password)}&${encodeURI('grant_type')}=${encodeURI('password')}&${encodeURI('client_id')}=${encodeURI('70f04fecfdf84d80a083b6814c9e10d8')}`;

    let req;
    try {
      req = https.request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(requestBody),
        },
        method: 'POST',
        port: 443,
        hostname: process.env.AUTHENTICATION_URL,
        path: '/oauth2/token',
      }, (res) => {
        res.setEncoding('utf8');

        let responseBody = '';

        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', function () {
          res.statusCode !== 200 ? reject("Invalid username or password") : resolve(responseBody);
        });
      });
    } catch (err) {
      reject();
    }

    req.write(requestBody);
    req.end();
  });
}
