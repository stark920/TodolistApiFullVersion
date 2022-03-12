const http = require('http');
const {requestListener} = require('./route');
const {PORT = 3000} = process.env;
const server = http.createServer(requestListener);
server.listen(PORT);