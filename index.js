/*
 * Primary file for the Application 
 * 
 * 
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const handlers = require('./handlers');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer((req, res) => unifiedServer(req, res));

httpServer.listen(config.http, () =>
  console.log(`The http server is running on port ${config.http}`)
);

const httpsServerCreds = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerCreds, (req, res) =>
  unifiedServer(req, res)
);

httpsServer.listen(config.https, () =>
  console.log(`The https server is running on port ${config.https}`)
);

// Configure the server to respond to all requests with a string
const unifiedServer = (req, res) => {
  // Parse the url
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the queryString
  const queryString = parsedUrl.query;

  // Get the method of the request
  const method = req.method;

  // Get the requst headers
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let payload = '';

  req.on('data', data => (payload += decoder.write(data)));
  req.on('end', () => {
    payload += decoder.end();

    const handler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      queryString,
      method,
      headers,
      payload
    };

    handler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == 'number' ? statusCode : 200;
      payload = typeof payload == 'object' ? payload : {};
      // Stringify the payload to send to the response
      const payloadString = JSON.stringify(payload);
      // Response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Notify the response to the console
      console.log(`Returning this response: ${statusCode}, ${payloadString}`);
    });
  });
};

const router = {
  ping: handlers.ping
};
