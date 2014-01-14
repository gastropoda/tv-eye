var connect = require('connect');
connect.createServer( connect.static("../tv-eye-js") ).listen(8080);
